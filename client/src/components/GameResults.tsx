import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trophy, Crown, Target, Clock, Users, RotateCcw, Home, Share } from "lucide-react";
import PlayerAvatar from "./PlayerAvatar";
import { useToast } from "@/hooks/use-toast";

interface GameResultsProps {
  gameStats: {
    duration: number; // seconds played
    totalPlayers: number;
    missionsCompleted: number;
    totalGuesses: number;
    correctGuesses: number;
  };
  players: Array<{
    id: string;
    name: string;
    avatar?: string;
    result: 'winner' | 'survivor' | 'eliminated';
    mission?: string;
    completedMission: boolean;
    correctGuesses: number;
    incorrectGuesses: number;
  }>;
  winCondition: 'time-up' | 'last-survivor' | 'mission-complete';
  onPlayAgain?: () => void;
  onReturnToMenu?: () => void;
}

export default function GameResults({ 
  gameStats, 
  players, 
  winCondition,
  onPlayAgain,
  onReturnToMenu 
}: GameResultsProps) {
  const { toast } = useToast();
  
  const winners = players.filter(p => p.result === 'winner');
  const survivors = players.filter(p => p.result === 'survivor');
  const eliminated = players.filter(p => p.result === 'eliminated');

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getWinConditionText = () => {
    switch (winCondition) {
      case 'time-up':
        return 'Time ran out - surviving players win!';
      case 'last-survivor':
        return 'Only one player remains undiscovered!';
      case 'mission-complete':
        return 'Winner completed their mission first!';
      default:
        return 'Game completed!';
    }
  };

  const shareResults = () => {
    const resultText = `Just played Secret Missions! ${winners.length > 1 ? 'We' : winners[0]?.name} won by ${winCondition}. ${gameStats.totalPlayers} players, ${Math.floor(gameStats.duration / 60)} minutes of fun!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Secret Missions Game Results',
        text: resultText,
      });
    } else {
      navigator.clipboard.writeText(resultText);
      toast({
        title: "Results Copied!",
        description: "Share your game results with friends",
      });
    }
    console.log('Shared results:', resultText);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gaming-mission-card/5 to-primary/10 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gaming-success/20 to-gaming-warning/20" />
          <CardContent className="relative p-8 text-center">
            <Trophy className="w-16 h-16 mx-auto text-gaming-warning mb-4" />
            <h1 className="text-3xl font-gaming font-bold mb-2">Game Complete!</h1>
            <p className="text-lg text-muted-foreground mb-4">
              {getWinConditionText()}
            </p>
            <div className="flex justify-center gap-4">
              <Badge variant="outline" className="text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {formatDuration(gameStats.duration)}
              </Badge>
              <Badge variant="outline" className="text-sm">
                <Users className="w-4 h-4 mr-1" />
                {gameStats.totalPlayers} players
              </Badge>
              <Badge variant="outline" className="text-sm">
                <Target className="w-4 h-4 mr-1" />
                {gameStats.correctGuesses} correct guesses
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Winners & Survivors */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Winners */}
            {winners.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gaming-success">
                    <Crown className="w-5 h-5" />
                    {winners.length === 1 ? 'Winner' : 'Winners'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {winners.map((player, index) => (
                      <div key={player.id} className="relative">
                        <PlayerAvatar 
                          id={player.id}
                          name={player.name}
                          status="completed"
                          avatar={player.avatar}
                        />
                        {index === 0 && (
                          <div className="absolute -top-2 -right-2">
                            <div className="w-8 h-8 bg-gaming-warning rounded-full flex items-center justify-center">
                              <Crown className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                        <div className="mt-2 text-center space-y-1">
                          <div className="text-xs font-medium">Mission Completed</div>
                          {player.mission && (
                            <div className="text-xs text-muted-foreground">
                              "{player.mission}"
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Survivors */}
            {survivors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Survivors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {survivors.map((player) => (
                      <div key={player.id}>
                        <PlayerAvatar 
                          id={player.id}
                          name={player.name}
                          status="active"
                          avatar={player.avatar}
                        />
                        <div className="mt-2 text-center">
                          <div className="text-xs text-muted-foreground">
                            Avoided detection
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Eliminated Players */}
            {eliminated.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-muted-foreground">
                    <Target className="w-5 h-5" />
                    Eliminated Players
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {eliminated.map((player) => (
                      <div key={player.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                        <PlayerAvatar 
                          id={player.id}
                          name={player.name}
                          status="eliminated"
                          avatar={player.avatar}
                        />
                        <div className="flex-1">
                          <div className="font-medium">{player.name}</div>
                          {player.mission && (
                            <div className="text-sm text-muted-foreground">
                              Mission: "{player.mission}"
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {player.correctGuesses} correct, {player.incorrectGuesses} wrong guesses
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Game Statistics & Actions */}
          <div className="space-y-6">
            
            {/* Game Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Game Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Duration</div>
                    <div className="font-semibold">{formatDuration(gameStats.duration)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Total Players</div>
                    <div className="font-semibold">{gameStats.totalPlayers}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Missions Done</div>
                    <div className="font-semibold">{gameStats.missionsCompleted}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Total Guesses</div>
                    <div className="font-semibold">{gameStats.totalGuesses}</div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Guess Accuracy</div>
                  <div className="text-2xl font-bold">
                    {gameStats.totalGuesses > 0 
                      ? Math.round((gameStats.correctGuesses / gameStats.totalGuesses) * 100)
                      : 0
                    }%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {gameStats.correctGuesses} of {gameStats.totalGuesses} guesses correct
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="p-6 space-y-3">
                <Button 
                  onClick={() => {
                    console.log('Playing again...');
                    onPlayAgain?.();
                  }}
                  className="w-full"
                  data-testid="button-play-again"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={shareResults}
                  className="w-full"
                  data-testid="button-share-results"
                >
                  <Share className="w-4 h-4 mr-2" />
                  Share Results
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => {
                    console.log('Returning to menu...');
                    onReturnToMenu?.();
                  }}
                  className="w-full"
                  data-testid="button-return-menu"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Return to Menu
                </Button>
              </CardContent>
            </Card>

            {/* Achievement/Fun Fact */}
            <Card className="bg-gaming-mission-card/10">
              <CardHeader>
                <CardTitle className="text-sm">🎭 Fun Fact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {winners.length > 0 && winners[0].completedMission
                    ? `${winners[0].name} successfully completed their secret mission while staying undetected!`
                    : `This game had ${gameStats.correctGuesses} successful mission discoveries out of ${gameStats.totalGuesses} attempts.`
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}