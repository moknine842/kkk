import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Copy, Settings, Play, Users, Clock, Target, Crown, UserPlus, Zap, Edit3 } from "lucide-react";
import PlayerAvatar from "./PlayerAvatar";
import GameTimer from "./GameTimer";
import AvatarSelector from "./AvatarSelector";
import { useToast } from "@/hooks/use-toast";
import { type AvatarConfig, createDefaultAvatar } from "@/lib/avatarData";

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

interface LobbyInterfaceProps {
  lobbyCode: string;
  isHost: boolean;
  players: Array<{
    id: string;
    name: string;
    status: 'active' | 'host';
    avatar?: string;
  }>;
  gameSettings: LobbySettings;
  gameMode?: 'local' | 'online';
  onUpdateSettings?: (settings: LobbySettings) => void;
  onStartGame?: () => void;
  onKickPlayer?: (playerId: string) => void;
}

export default function LobbyInterface({ 
  lobbyCode, 
  isHost, 
  players, 
  gameSettings,
  gameMode = 'online',
  onUpdateSettings,
  onStartGame,
  onKickPlayer 
}: LobbyInterfaceProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  const [currentPlayerAvatar, setCurrentPlayerAvatar] = useState<AvatarConfig>(
    createDefaultAvatar(players.find(p => p.status === 'host' || !isHost)?.name || "Player")
  );
  const { toast } = useToast();

  const copyLobbyCode = () => {
    navigator.clipboard.writeText(lobbyCode);
    toast({
      title: "Lobby Code Copied",
      description: "Share this code with friends to join the game!",
    });
    console.log('Lobby code copied:', lobbyCode);
  };

  const handleStartGame = () => {
    console.log('Starting game...');
    onStartGame?.();
  };

  const canStartGame = players.length >= 4;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header with Lobby Code */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-gaming-player-highlight/10" />
          <CardContent className="relative p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-gaming font-bold">Game Lobby</h1>
                <p className="text-muted-foreground">
                  {isHost ? "You're hosting this game" : "Waiting for host to start"}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <Label className="text-xs text-muted-foreground">LOBBY CODE</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-2xl font-gaming font-bold px-3 py-1 bg-card rounded border">
                      {lobbyCode}
                    </code>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={copyLobbyCode}
                      data-testid="button-copy-code"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {gameMode === 'online' && (
                    <Button
                      variant="outline"
                      onClick={() => setShowAvatarEditor(true)}
                      data-testid="button-edit-avatar"
                      className="flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Avatar
                    </Button>
                  )}
                  
                  {isHost && (
                    <Button
                      variant="outline"
                      onClick={() => setShowSettings(!showSettings)}
                      data-testid="button-settings"
                      className="flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Players Section */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Current Players */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Players ({players.length}/{gameSettings.maxPlayers})
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant={canStartGame ? "default" : "secondary"}>
                    {canStartGame ? "Ready to Start" : "Need More Players"}
                  </Badge>
                  {canStartGame && (
                    <Badge variant="outline" className="text-gaming-success border-gaming-success">
                      Minimum Met
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {players.map((player) => (
                    <div key={player.id} className="relative">
                      <PlayerAvatar 
                        id={player.id}
                        name={player.name}
                        status={player.status}
                        avatar={player.avatar}
                        onClick={() => console.log(`Clicked player ${player.name}`)}
                      />
                      {isHost && player.status !== 'host' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 text-xs"
                          onClick={() => onKickPlayer?.(player.id)}
                          data-testid={`button-kick-${player.id}`}
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  {/* Empty Slots */}
                  {Array.from({ length: gameSettings.maxPlayers - players.length }, (_, i) => (
                    <div 
                      key={`empty-${i}`}
                      className="border-2 border-dashed border-muted rounded-lg p-4 flex flex-col items-center justify-center text-muted-foreground space-y-2"
                    >
                      <UserPlus className="w-8 h-8" />
                      <span className="text-xs">Waiting for player</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Game Settings Display */}
            {showSettings && isHost && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Game Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Basic Settings */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Basic Settings</Label>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Max Players</Label>
                          <Select 
                            value={gameSettings.maxPlayers.toString()} 
                            onValueChange={(value) => onUpdateSettings?.({ ...gameSettings, maxPlayers: parseInt(value) })}
                          >
                            <SelectTrigger data-testid="select-max-players">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="4">4 Players</SelectItem>
                              <SelectItem value="6">6 Players</SelectItem>
                              <SelectItem value="8">8 Players</SelectItem>
                              <SelectItem value="10">10 Players</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Game Duration</Label>
                          <Select 
                            value={gameSettings.gameDuration.toString()} 
                            onValueChange={(value) => onUpdateSettings?.({ ...gameSettings, gameDuration: parseInt(value) })}
                          >
                            <SelectTrigger data-testid="select-game-duration">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10">10 minutes</SelectItem>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="20">20 minutes</SelectItem>
                              <SelectItem value="30">30 minutes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                        <div className="space-y-1">
                          <Label>Allow Spectators</Label>
                          <p className="text-xs text-muted-foreground">Let others watch without playing</p>
                        </div>
                        <Switch
                          checked={gameSettings.allowSpectators}
                          onCheckedChange={(checked) => onUpdateSettings?.({ ...gameSettings, allowSpectators: checked })}
                          data-testid="switch-allow-spectators"
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Special Features */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        <Label className="text-base font-medium">Special Game Features</Label>
                        <Badge variant="outline" className="text-xs">Optional</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Enable special gameplay mechanics to enhance your game experience
                      </p>

                      <div className="space-y-3">
                        {[
                          {
                            key: 'missionSwitching' as const,
                            title: 'Mission Switching',
                            description: 'Players can swap missions with others during gameplay'
                          },
                          {
                            key: 'duoMissions' as const,
                            title: 'Duo Missions',
                            description: 'Some missions require collaboration between two players'
                          },
                          {
                            key: 'noMissionPlayers' as const,
                            title: 'No Mission Players',
                            description: 'Some players have no mission and must eliminate others'
                          },
                          {
                            key: 'timerVariations' as const,
                            title: 'Timer Variations',
                            description: 'Dynamic time limits that change based on game events'
                          },
                          {
                            key: 'secretAlliances' as const,
                            title: 'Secret Alliances',
                            description: 'Hidden team formations revealed during the game'
                          }
                        ].map((feature, index) => (
                          <motion.div
                            key={feature.key}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 bg-card rounded-lg hover-elevate"
                          >
                            <div className="space-y-1">
                              <Label>{feature.title}</Label>
                              <p className="text-xs text-muted-foreground">{feature.description}</p>
                            </div>
                            <Switch
                              checked={gameSettings.specialFeatures[feature.key]}
                              onCheckedChange={(checked) => onUpdateSettings?.({ 
                                ...gameSettings, 
                                specialFeatures: {
                                  ...gameSettings.specialFeatures,
                                  [feature.key]: checked
                                }
                              })}
                              data-testid={`switch-${feature.key.replace(/([A-Z])/g, '-$1').toLowerCase()}`}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Game Info & Controls */}
          <div className="space-y-6">
            
            {/* Game Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Game Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Duration</div>
                    <div className="font-semibold flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {gameSettings.gameDuration}m
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Mode</div>
                    <div className="font-semibold capitalize">{gameMode}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Max Players</div>
                    <div className="font-semibold">{gameSettings.maxPlayers}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Spectators</div>
                    <div className="font-semibold">
                      {gameSettings.allowSpectators ? 'Allowed' : 'Not Allowed'}
                    </div>
                  </div>
                </div>
                
                {/* Special Features Summary */}
                {Object.values(gameSettings.specialFeatures).some(Boolean) && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        Active Features:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(gameSettings.specialFeatures)
                          .filter(([_, enabled]) => enabled)
                          .map(([key, _]) => (
                            <Badge key={key} variant="secondary" className="text-xs">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </>
                )}
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">How to Win:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Complete your secret mission</li>
                    <li>• Avoid being discovered by others</li>
                    <li>• Eliminate opponents by guessing their missions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Start Game Button */}
            {isHost && (
              <Card>
                <CardContent className="p-6">
                  {canStartGame ? (
                    <Button 
                      onClick={handleStartGame}
                      className="w-full h-12 text-lg font-semibold"
                      data-testid="button-start-game"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Start Game
                    </Button>
                  ) : (
                    <div className="text-center space-y-3">
                      <Button disabled className="w-full h-12">
                        <Users className="w-5 h-5 mr-2" />
                        Need {4 - players.length} More Players
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Share the lobby code with friends to join
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Waiting Message for Non-Hosts */}
            {!isHost && (
              <Card className="bg-muted/50">
                <CardContent className="p-6 text-center">
                  <Crown className="w-8 h-8 text-gaming-warning mx-auto mb-2" />
                  <h3 className="font-semibold">Waiting for Host</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    The game will start when the host is ready
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Avatar Editor Dialog - Online Mode Only */}
      {gameMode === 'online' && showAvatarEditor && (
        <AvatarSelector
          playerName={players.find(p => p.status === 'host' && isHost)?.name || players[0]?.name || "Player"}
          currentAvatar={currentPlayerAvatar}
          onAvatarChange={(newAvatar) => {
            setCurrentPlayerAvatar(newAvatar);
            toast({
              title: "Avatar Updated",
              description: "Your avatar has been customized successfully!",
            });
          }}
          onClose={() => setShowAvatarEditor(false)}
        />
      )}
    </div>
  );
}