import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWebSocket } from '@/hooks/useWebSocket';

export function JoinGame() {
  const [, setLocation] = useLocation();
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🎮');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');

  const { isConnected, sendMessage } = useWebSocket((message) => {
    if (message.event === 'missions_distributed') {
      const gameId = localStorage.getItem('currentGameId');
      if (gameId) {
        setLocation(`/game/${gameId}/play`);
      }
    }
  });

  const joinGame = async () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!roomCode.trim() || roomCode.length !== 6) {
      setError('Please enter a valid 6-digit room code');
      return;
    }

    setIsJoining(true);
    setError('');

    try {
      const response = await fetch('/api/games/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode: roomCode.toUpperCase(),
          playerName,
          playerAvatar: selectedAvatar,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to join game');
      }

      const data = await response.json();
      
      // Store game info and register with WebSocket
      localStorage.setItem('currentGameId', data.game.id);
      localStorage.setItem('currentPlayerId', data.player.id);
      sendMessage('register_player', { playerId: data.player.id });
      
      // Navigate to mission entry
      setLocation(`/game/${data.game.id}/missions`);
      
    } catch (error) {
      console.error('Error joining game:', error);
      setError(error instanceof Error ? error.message : 'Failed to join game');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Join Game</CardTitle>
          <CardDescription>
            Enter the 6-digit room code to join a game
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roomCode">Room Code</Label>
            <Input
              id="roomCode"
              placeholder="Enter 6-digit code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="text-center text-2xl font-mono tracking-wider"
            />
          </div>

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

          {error && (
            <div className="text-sm text-red-500 text-center p-2 bg-red-50 rounded">
              {error}
            </div>
          )}

          <Button 
            onClick={joinGame} 
            disabled={isJoining || !isConnected}
            className="w-full"
          >
            {isJoining ? 'Joining...' : 'Join Game'}
          </Button>

          {!isConnected && (
            <p className="text-sm text-center text-red-500">
              Connecting to server...
            </p>
          )}

          <Button 
            variant="outline" 
            onClick={() => setLocation('/')}
            className="w-full"
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
