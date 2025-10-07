import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award } from 'lucide-react';
import type { Player } from '@shared/schema';

export function GameResults() {
  const [, setLocation] = useLocation();
  const { gameId } = useParams<{ gameId: string }>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, [gameId]);

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/games/${gameId}`);
      const data = await response.json();
      
      // Sort players by points (descending)
      const sortedPlayers = [...data.players].sort((a, b) => b.points - a.points);
      setPlayers(sortedPlayers);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPositionIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-8 w-8 text-yellow-500" />;
      case 1:
        return <Medal className="h-8 w-8 text-gray-400" />;
      case 2:
        return <Award className="h-8 w-8 text-amber-600" />;
      default:
        return null;
    }
  };

  const getPositionClass = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-400';
      case 1:
        return 'bg-gradient-to-r from-gray-100 to-slate-100 border-gray-400';
      case 2:
        return 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-400';
      default:
        return 'bg-white border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-4xl">Game Over!</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Final Scores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {players.map((player, index) => (
              <Card key={player.id} className={`border-2 ${getPositionClass(index)}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-gray-600">
                          #{index + 1}
                        </span>
                        {getPositionIcon(index)}
                      </div>
                      <span className="text-5xl">{player.avatar}</span>
                      <div>
                        <p className="text-xl font-bold">{player.name}</p>
                        {player.isHost && (
                          <p className="text-sm text-purple-600">Host</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-bold text-purple-600">
                        {player.points}
                      </p>
                      <p className="text-sm text-gray-600">points</p>
                    </div>
                  </div>

                  {player.isEliminated && (
                    <div className="mt-3 text-sm text-red-600">
                      Mission discovered
                    </div>
                  )}
                  {player.missionCompleted && (
                    <div className="mt-3 text-sm text-green-600">
                      Mission completed ✓
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button 
            onClick={() => setLocation('/')}
            className="flex-1"
            size="lg"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
