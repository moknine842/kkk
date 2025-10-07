import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plus, X, Users, Smartphone, ArrowRight, UserPlus, Play } from "lucide-react";

interface PlayerRosterFormProps {
  onBack: () => void;
  onContinue: (players: string[]) => void;
  title?: string;
  subtitle?: string;
}

export default function PlayerRosterForm({ 
  onBack, 
  onContinue, 
  title = "Enter Player Names",
  subtitle = "Add all players who will participate in this game"
}: PlayerRosterFormProps) {
  const [players, setPlayers] = useState<string[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < 10 && !players.includes(newPlayerName.trim())) {
      setPlayers([...players, newPlayerName.trim()]);
      setNewPlayerName("");
      console.log('Player added:', newPlayerName.trim());
    }
  };

  const removePlayer = (index: number) => {
    const removedPlayer = players[index];
    setPlayers(players.filter((_, i) => i !== index));
    console.log('Player removed:', removedPlayer);
  };

  const handleContinue = () => {
    console.log('Continuing with players:', players);
    onContinue(players);
  };

  const canContinue = players.length >= 4;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gaming-player-highlight/10 to-primary/10" />
          
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                data-testid="button-back-roster"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gaming-player-highlight/20 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-gaming-player-highlight" />
                </div>
                <div>
                  <CardTitle className="text-xl font-gaming">{title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {subtitle}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative space-y-6">
            {/* Add Player Section */}
            <motion.div variants={itemVariants} className="space-y-4">
              <Label className="text-base font-medium">Add Players</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter player name..."
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                  maxLength={20}
                  disabled={players.length >= 10}
                  data-testid="input-roster-player"
                  className="flex-1"
                />
                <Button
                  onClick={addPlayer}
                  disabled={!newPlayerName.trim() || players.length >= 10 || players.includes(newPlayerName.trim())}
                  data-testid="button-add-roster-player"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum 4 players required, maximum 10 players. Names must be unique.
              </p>
            </motion.div>

            <Separator />

            {/* Players List */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Players ({players.length}/10)</Label>
                <Badge variant={canContinue ? "default" : "secondary"}>
                  {canContinue ? "Ready to Continue" : "Need More Players"}
                </Badge>
              </div>

              {players.length === 0 ? (
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No players added yet</p>
                  <p className="text-sm text-muted-foreground">Add at least 4 players to continue</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {players.map((player, index) => (
                    <motion.div
                      key={`${player}-${index}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between p-3 bg-card border rounded-lg hover-elevate"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {player.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium" data-testid={`roster-player-${index}`}>
                          {player}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePlayer(index)}
                        data-testid={`button-remove-roster-${index}`}
                        className="text-muted-foreground hover:text-gaming-danger"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Continue Button */}
            <motion.div variants={itemVariants}>
              {canContinue ? (
                <Button
                  onClick={handleContinue}
                  className="w-full h-12 text-lg font-semibold"
                  data-testid="button-continue-roster"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Continue to Game Setup
                </Button>
              ) : (
                <Button disabled className="w-full h-12">
                  <Users className="w-5 h-5 mr-2" />
                  Need {4 - players.length} More Players
                </Button>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}