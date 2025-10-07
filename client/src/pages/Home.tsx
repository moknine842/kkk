import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import GameModeSelector from "@/components/GameModeSelector";
import OnlineModeSelector from "@/components/OnlineModeSelector";
import LocalLobbyManager from "@/components/LocalLobbyManager";
import LobbyInterface from "@/components/LobbyInterface";
import ThemeToggle from "@/components/ThemeToggle";
import { type AvatarConfig } from "@/lib/avatarData";

type GameState = 'mode-select' | 'local-setup' | 'online-select' | 'lobby' | 'game';
type OnlineFlow = 'create' | 'join';

interface LobbySettings {
  maxPlayers: number;
  gameDuration: number;
  allowSpectators: boolean;
  specialFeatures: {
    missionSwitching: boolean;
    duoMissions: boolean;
    noMissionPlayers: boolean;
    timerVariations: boolean;
    secretAlliances: boolean;
  };
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [gameState, setGameState] = useState<GameState>('mode-select');
  const [gameMode, setGameMode] = useState<'local' | 'online' | null>(null);
  const [onlineFlow, setOnlineFlow] = useState<OnlineFlow>('create');
  const [players, setPlayers] = useState<string[]>([]);
  const [lobbySettings, setLobbySettings] = useState<LobbySettings | null>(null);
  const [playerAvatar, setPlayerAvatar] = useState<AvatarConfig | null>(null);
  
  // Mock lobby data for online mode
  const mockOnlinePlayers = [
    { id: '1', name: 'Alex Chen', status: 'host' as const },
    { id: '2', name: 'You', status: 'active' as const },
    { id: '3', name: 'Maria Garcia', status: 'active' as const },
    { id: '4', name: 'John Smith', status: 'active' as const },
  ];

  const defaultSettings: LobbySettings = {
    maxPlayers: 8,
    gameDuration: 20,
    allowSpectators: true,
    specialFeatures: {
      missionSwitching: false,
      duoMissions: false,
      noMissionPlayers: false,
      timerVariations: true,
      secretAlliances: false,
    }
  };

  const handleModeSelect = (mode: 'local' | 'online') => {
    setGameMode(mode);
    console.log(`${mode} mode selected`);
    
    if (mode === 'local') {
      setGameState('local-setup');
    } else {
      // For online mode, show the selection screen first
      setGameState('online-select');
    }
  };

  const handleOnlineFlowSelect = (flow: OnlineFlow) => {
    setOnlineFlow(flow);
    if (flow === 'create') {
      setLocation('/online/create');
    } else {
      setLocation('/online/join');
    }
  };

  const handleBackToModeSelect = () => {
    setGameState('mode-select');
    setGameMode(null);
    setPlayers([]);
    setLobbySettings(null);
    setPlayerAvatar(null);
  };

  const handleLocalPlayersReady = (playerList: string[]) => {
    console.log('Local players ready:', playerList);
    setPlayers(playerList);
    setLobbySettings(defaultSettings);
    setGameState('lobby');
  };

  const handleStartGame = () => {
    console.log('Starting game with players:', players);
    setGameState('game');
  };

  // Create players data for lobby interface
  const getLobbyPlayers = () => {
    if (gameMode === 'local') {
      return players.map((name, index) => ({
        id: `local-${index}`,
        name,
        status: index === 0 ? 'host' as const : 'active' as const
      }));
    } else {
      // For online mode, use actual player data with avatar config
      return players.map((name, index) => ({
        id: `online-${index}`,
        name,
        status: index === 0 ? 'host' as const : 'active' as const,
        avatarConfig: index === 0 ? playerAvatar || undefined : undefined
      }));
    }
  };

  const renderCurrentState = () => {
    const currentKey = `${gameState}-${gameMode}-${onlineFlow}`;
    
    switch (gameState) {
      case 'mode-select':
        return (
          <GameModeSelector 
            key="mode-select"
            onSelectMode={handleModeSelect} 
          />
        );
        
      case 'local-setup':
        return (
          <LocalLobbyManager
            key="local-setup"
            onBack={handleBackToModeSelect}
            onStartGame={handleLocalPlayersReady}
          />
        );
        
      case 'online-select':
        return (
          <OnlineModeSelector
            key="online-select"
            onBack={handleBackToModeSelect}
            onSelectFlow={handleOnlineFlowSelect}
          />
        );
        
      case 'lobby':
        return (
          <LobbyInterface
            key={`lobby-${gameMode}`}
            lobbyCode={gameMode === 'online' ? "DEMO123" : "LOCAL"}
            isHost={true}
            players={getLobbyPlayers()}
            gameSettings={lobbySettings || defaultSettings}
            gameMode={gameMode || 'local'}
            onStartGame={handleStartGame}
            onUpdateSettings={setLobbySettings}
          />
        );
        
      case 'game':
        return (
          <div key="game" className="min-h-screen bg-gradient-to-br from-background to-primary/5 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-gaming font-bold mb-4">Game Started!</h1>
              <p className="text-muted-foreground">Game implementation coming soon...</p>
              <button 
                onClick={handleBackToModeSelect}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded"
              >
                Back to Home
              </button>
            </div>
          </div>
        );
        
      default:
        return <GameModeSelector key="default" onSelectMode={handleModeSelect} />;
    }
  };

  return (
    <div className="relative">
      {/* Theme Toggle - Fixed position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={gameState}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {renderCurrentState()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}