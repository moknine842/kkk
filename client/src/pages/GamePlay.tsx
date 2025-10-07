import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWebSocket } from '@/hooks/useWebSocket';
import type { Game, Player, Mission } from '@shared/schema';
import { Heart, Trophy, Clock, Eye, EyeOff } from 'lucide-react';

export function GamePlay() {
  const [, setLocation] = useLocation();
  const { gameId } = useParams<{ gameId: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [myMission, setMyMission] = useState<Mission | null>(null);
  const [missionVisible, setMissionVisible] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showEliminateDialog, setShowEliminateDialog] = useState(false);
  const [showGuesserDialog, setShowGuesserDialog] = useState(false);
  const [guessingPlayerId, setGuessingPlayerId] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const playerId = localStorage.getItem('currentPlayerId');
  const currentPlayer = players.find(p => p.id === playerId);
  const isHost = currentPlayer?.isHost || false;

  const { sendMessage } = useWebSocket((message) => {
    if (message.event === 'player_updated' || message.event === 'player_joined') {
      fetchGameState();
    }
    if (message.event === 'game_ended') {
      setLocation(`/game/${gameId}/results`);
    }
  });

  useEffect(() => {
    fetchGameState();
    fetchMyMission();
  }, [gameId]);

  useEffect(() => {
    if (game?.timerStartedAt && game?.timerDuration) {
      const interval = setInterval(() => {
        const startTime = new Date(game.timerStartedAt!).getTime();
        const duration = game.timerDuration! * 60 * 1000;
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, duration - elapsed);
        
        setTimeRemaining(Math.floor(remaining / 1000));
        
        if (remaining === 0 && isHost) {
          endGame();
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [game, isHost]);

  const fetchGameState = async () => {
    try {
      const response = await fetch(`/api/games/${gameId}`);
      const data = await response.json();
      setGame(data.game);
      setPlayers(data.players);
    } catch (error) {
      console.error('Error fetching game state:', error);
    }
  };

  const fetchMyMission = async () => {
    if (!playerId) return;
    
    try {
      const response = await fetch(`/api/missions/player/${playerId}`);
      const data = await response.json();
      setMyMission(data.mission);
    } catch (error) {
      console.error('Error fetching mission:', error);
    }
  };

  const handlePlayerAction = async (action: string, targetPlayer: Player) => {
    setSelectedPlayer(targetPlayer);
    
    if (action === 'eliminate') {
      setShowGuesserDialog(true);
    } else {
      await performAction(action, targetPlayer.id);
    }
  };

  const performAction = async (action: string, targetPlayerId: string, guesser?: string) => {
    try {
      const response = await fetch(`/api/players/${targetPlayerId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          guessingPlayerId: guesser,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to perform action');
      }

      sendMessage('game_update', { gameId, action, playerId: targetPlayerId });
      fetchGameState();
      
    } catch (error) {
      console.error('Error performing action:', error);
      alert('Failed to perform action');
    }
  };

  const confirmElimination = async () => {
    if (!selectedPlayer || !guessingPlayerId) return;
    
    await performAction('eliminate', selectedPlayer.id, guessingPlayerId);
    setShowGuesserDialog(false);
    setGuessingPlayerId('');
    setSelectedPlayer(null);
  };

  const endGame = async () => {
    try {
      await fetch(`/api/games/${gameId}/end`, {
        method: 'POST',
      });
      setLocation(`/game/${gameId}/results`);
    } catch (error) {
      console.error('Error ending game:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!game || !currentPlayer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto space-y-4 py-4">
        {/* Timer and Game Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Clock className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Time Remaining</p>
                  <p className="text-2xl font-bold">
                    {timeRemaining !== null ? formatTime(timeRemaining) : '--:--'}
                  </p>
                </div>
              </div>
              {isHost && (
                <Button onClick={endGame} variant="destructive">
                  End Game
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* My Mission */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your Mission</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMissionVisible(!missionVisible)}
              >
                {missionVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {missionVisible && myMission ? (
              <p className="text-lg">{myMission.missionText}</p>
            ) : (
              <p className="text-gray-400 italic">Click to reveal your mission</p>
            )}
          </CardContent>
        </Card>

        {/* Players */}
        <Card>
          <CardHeader>
            <CardTitle>Players</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {players.map((player) => (
                <Card key={player.id} className={player.isEliminated ? 'opacity-50' : ''}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{player.avatar}</span>
                        <div>
                          <p className="font-semibold text-lg">{player.name}</p>
                          {player.isHost && (
                            <Badge variant="secondary" className="mr-2">Host</Badge>
                          )}
                          {player.isEliminated && (
                            <Badge variant="destructive">Eliminated</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span className="font-bold">{player.lives}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="font-bold">{player.points}</span>
                        </div>
                      </div>
                    </div>

                    {isHost && !player.isEliminated && player.id !== playerId && (
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handlePlayerAction('eliminate', player)}
                          className="flex-1"
                        >
                          Eliminate
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePlayerAction('subtract_life', player)}
                          className="flex-1"
                        >
                          -1 Life
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handlePlayerAction('mission_completed', player)}
                          className="flex-1"
                        >
                          Completed
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Guesser Selection Dialog */}
        <Dialog open={showGuesserDialog} onOpenChange={setShowGuesserDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Who Guessed Correctly?</DialogTitle>
              <DialogDescription>
                Select the player who correctly guessed {selectedPlayer?.name}'s mission
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Select value={guessingPlayerId} onValueChange={setGuessingPlayerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select player" />
                </SelectTrigger>
                <SelectContent>
                  {players
                    .filter(p => p.id !== selectedPlayer?.id && !p.isEliminated)
                    .map(player => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.avatar} {player.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowGuesserDialog(false)}>
                Cancel
              </Button>
              <Button onClick={confirmElimination} disabled={!guessingPlayerId}>
                Confirm Elimination
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
