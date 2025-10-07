import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Send, AlertTriangle, CheckCircle, XCircle, Users } from "lucide-react";
import PlayerAvatar from "./PlayerAvatar";

interface GuessInterfaceProps {
  players: Array<{
    id: string;
    name: string;
    status: 'active' | 'eliminated' | 'completed' | 'host';
    avatar?: string;
  }>;
  currentPlayerId: string;
  incorrectGuesses: number;
  maxIncorrectGuesses: number;
  onSubmitGuess: (targetPlayerId: string, guessedMission: string) => void;
}

export default function GuessInterface({ 
  players, 
  currentPlayerId, 
  incorrectGuesses, 
  maxIncorrectGuesses,
  onSubmitGuess 
}: GuessInterfaceProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [guessedMission, setGuessedMission] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const eligiblePlayers = players.filter(p => 
    p.id !== currentPlayerId && p.status !== 'eliminated'
  );

  const remainingGuesses = maxIncorrectGuesses - incorrectGuesses;
  const isAtRisk = remainingGuesses <= 1;

  const handleSubmitGuess = async () => {
    if (!selectedPlayer || !guessedMission.trim()) return;

    setIsSubmitting(true);
    console.log(`Guessing ${guessedMission} for player ${selectedPlayer}`);
    
    // Simulate API call delay
    setTimeout(() => {
      onSubmitGuess(selectedPlayer, guessedMission.trim());
      setSelectedPlayer("");
      setGuessedMission("");
      setIsSubmitting(false);
    }, 1000);
  };

  const selectedPlayerData = eligiblePlayers.find(p => p.id === selectedPlayer);

  return (
    <div className="space-y-6">
      {/* Guess Status Warning */}
      {isAtRisk && (
        <Card className="border-gaming-danger bg-gaming-danger/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-gaming-danger flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gaming-danger">Careful!</h4>
                <p className="text-sm text-muted-foreground">
                  You have {remainingGuesses} incorrect guess{remainingGuesses === 1 ? '' : 'es'} remaining. 
                  One more wrong guess will eliminate you!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Guess Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Guess Someone's Mission
          </CardTitle>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Identify another player's secret mission to eliminate them
            </p>
            <Badge variant={isAtRisk ? "destructive" : "secondary"}>
              {remainingGuesses} guesses left
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Player Selection */}
          <div className="space-y-3">
            <Label htmlFor="player-select">Choose Target Player</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {eligiblePlayers.map((player) => (
                <div
                  key={player.id}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover-elevate ${
                    selectedPlayer === player.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedPlayer(player.id)}
                  data-testid={`select-player-${player.id}`}
                >
                  <div className="flex items-center gap-3">
                    <PlayerAvatar 
                      id={player.id}
                      name={player.name}
                      status={player.status}
                      avatar={player.avatar}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alternative Select Dropdown (for smaller screens or lots of players) */}
          {eligiblePlayers.length > 6 && (
            <div className="space-y-2">
              <Label htmlFor="player-dropdown">Or select from dropdown:</Label>
              <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
                <SelectTrigger data-testid="select-target-player">
                  <SelectValue placeholder="Choose a player to guess..." />
                </SelectTrigger>
                <SelectContent>
                  {eligiblePlayers.map((player) => (
                    <SelectItem key={player.id} value={player.id}>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {player.name}
                        <Badge variant="outline" className="ml-2 text-xs">
                          {player.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Mission Guess Input */}
          <div className="space-y-2">
            <Label htmlFor="mission-guess">
              What is {selectedPlayerData ? selectedPlayerData.name + "'s" : "their"} secret mission?
            </Label>
            <Textarea
              id="mission-guess"
              placeholder="Describe what you think their mission is... (e.g., 'Make someone laugh', 'Ask about the weather', 'Compliment someone's outfit')"
              value={guessedMission}
              onChange={(e) => setGuessedMission(e.target.value)}
              className="min-h-20"
              data-testid="input-mission-guess"
            />
            <p className="text-xs text-muted-foreground">
              Be specific! Vague guesses are more likely to be wrong.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmitGuess}
            disabled={!selectedPlayer || !guessedMission.trim() || isSubmitting}
            className="w-full flex items-center gap-2"
            data-testid="button-submit-guess"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Submitting Guess...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Guess
              </>
            )}
          </Button>

          {/* Previous Guesses Indicator */}
          {incorrectGuesses > 0 && (
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-gaming-danger" />
                <span className="text-sm font-medium">Previous Incorrect Guesses</span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: maxIncorrectGuesses }, (_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i < incorrectGuesses ? 'bg-gaming-danger' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="bg-gaming-mission-card/5">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-gaming-success" />
            Guessing Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-muted-foreground">
            • Watch for unusual behavior or repeated actions
          </p>
          <p className="text-xs text-muted-foreground">
            • Listen for specific words or phrases they keep using
          </p>
          <p className="text-xs text-muted-foreground">
            • Be specific in your guess - "make someone laugh" is better than "be funny"
          </p>
        </CardContent>
      </Card>
    </div>
  );
}