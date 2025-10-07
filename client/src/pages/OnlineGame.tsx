import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWebSocket } from '@/hooks/useWebSocket';
import type { Game, Player } from '@shared/schema';

export function OnlineGameLobby() {
  const [, setLocation] = useLocation();
  const [playerName, setPlayerName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🎮');
  const [gameData, setGameData] = useState<{ game: Game; player: Player } | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  
  const { isConnected, sendMessage } = useWebSocket((message) => {
    if (message.event === 'player_joined' && gameData) {
      fetchGameState(gameData.game.id);
    }
    if (message.event === 'missions_distributed' && gameData) {
      setLocation(`/game/${gameData.game.id}/play`);
    }
  });

  const fetchGameState = async (gameId: string) => {
    try {
      const response = await fetch(`/api/games/${gameId}`);
      const data = await response.json();
      setPlayers(data.players);
    } catch (error) {
      console.error('Error fetching game state:', error);
    }
  };

  const createGame = async () => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch('/api/games/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'online',
          hostName: playerName,
          hostAvatar: selectedAvatar,
          timerDuration: 30,
        }),
      });

      const data = await response.json();
      setGameData(data);
      setPlayers([data.player]);
      
      // Store game info in localStorage
      localStorage.setItem('currentGameId', data.game.id);
      localStorage.setItem('currentPlayerId', data.player.id);
      
      // Register with WebSocket
      sendMessage('register_player', { playerId: data.player.id });
      
    } catch (error) {
      console.error('Error creating game:', error);
      alert('Failed to create game');
    } finally {
      setIsCreating(false);
    }
  };

  const startGame = () => {
    if (gameData) {
      setLocation(`/game/${gameData.game.id}/missions`);
    }
  };

  if (!gameData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Create Online Game</CardTitle>
            <CardDescription>
              Host a game and invite friends with a room code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Choose Your Avatar</Label>
              <div className="grid grid-cols-6 gap-2">
                {['🎮', '👾', '🎯', '🎲', '🎪', '🎭', '🎨', '🎬', '🎸', '🎹', '🎤', '🎧'].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedAvatar(emoji)}
                    className={`text-3xl p-2 rounded border-2 transition ${
                      selectedAvatar === emoji
                        ? 'border-purple-500 bg-purple-100'
                        : 'border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              onClick={createGame} 
              disabled={isCreating || !isConnected}
              className="w-full"
            >
              {isCreating ? 'Creating...' : 'Create Game Room'}
            </Button>

            {!isConnected && (
              <p className="text-sm text-center text-red-500">
                Connecting to server...
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-3xl">Game Room</CardTitle>
            <CardDescription className="text-center text-xl font-mono">
              Room Code: <span className="text-purple-500 font-bold">{gameData.game.roomCode}</span>
            </CardDescription>
            <p className="text-center text-sm text-gray-500">
              Share this code with your friends to join
            </p>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Players ({players.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 border"
                >
                  <span className="text-3xl">{player.avatar}</span>
                  <div>
                    <p className="font-semibold">{player.name}</p>
                    {player.isHost && (
                      <p className="text-xs text-purple-600">Host</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {gameData.player.isHost && (
          <Button 
            onClick={startGame}
            disabled={players.length < 2}
            className="w-full"
            size="lg"
          >
            {players.length < 2 ? 'Waiting for players...' : 'Start Game'}
          </Button>
        )}

        {!gameData.player.isHost && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600">
                Waiting for host to start the game...
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
