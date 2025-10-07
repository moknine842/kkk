import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Smartphone, Wifi, Timer, Eye, Target } from "lucide-react";

interface GameModeProps {
  onSelectMode: (mode: 'local' | 'online') => void;
}

export default function GameModeSelector({ onSelectMode }: GameModeProps) {
  const [selectedMode, setSelectedMode] = useState<'local' | 'online' | null>(null);

  const handleModeSelect = (mode: 'local' | 'online') => {
    setSelectedMode(mode);
    console.log(`${mode} mode selected`);
    onSelectMode(mode);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-4xl space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-gaming font-bold text-foreground">Secret Missions</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Complete your secret mission without being discovered. Identify other players' missions to eliminate them.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              4+ Players
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Timer className="w-3 h-3" />
              10-30 min
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              Social Deduction
            </Badge>
          </div>
        </motion.div>

        {/* Game Mode Selection */}
        <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
          {/* Local Mode */}
          <Card 
            className={`hover-elevate cursor-pointer transition-all duration-200 ${
              selectedMode === 'local' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleModeSelect('local')}
            data-testid="card-local-mode"
          >
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gaming-player-highlight/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-gaming-player-highlight" />
              </div>
              <CardTitle className="text-xl font-gaming">Local Mode</CardTitle>
              <CardDescription>
                Pass one device around the table
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gaming-success rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Perfect for in-person game nights
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gaming-success rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Each player takes turns on the same device
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gaming-success rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Screen privacy automatically handled
                  </p>
                </div>
              </div>
              <Button 
                className="w-full" 
                variant={selectedMode === 'local' ? 'default' : 'outline'}
                data-testid="button-select-local"
              >
                Select Local Mode
              </Button>
            </CardContent>
          </Card>

          {/* Online Mode */}
          <Card 
            className={`hover-elevate cursor-pointer transition-all duration-200 ${
              selectedMode === 'online' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleModeSelect('online')}
            data-testid="card-online-mode"
          >
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wifi className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl font-gaming">Online Mode</CardTitle>
              <CardDescription>
                Each player uses their own device
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gaming-success rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Play remotely with friends anywhere
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gaming-success rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Built-in chat and communication
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gaming-success rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Private lobbies with room codes
                  </p>
                </div>
              </div>
              <Button 
                className="w-full" 
                variant={selectedMode === 'online' ? 'default' : 'outline'}
                data-testid="button-select-online"
              >
                Select Online Mode
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Game Rules Quick Reference */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gaming-mission-card/10">
          <CardHeader>
            <CardTitle className="text-lg font-gaming text-center">How to Play</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary-foreground font-bold">1</span>
                </div>
                <h4 className="font-semibold">Get Your Mission</h4>
                <p className="text-sm text-muted-foreground">
                  Receive a secret mission to complete during the game
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 bg-gaming-warning rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold">2</span>
                </div>
                <h4 className="font-semibold">Stay Hidden</h4>
                <p className="text-sm text-muted-foreground">
                  Complete your mission without others discovering it
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 bg-gaming-danger rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold">3</span>
                </div>
                <h4 className="font-semibold">Eliminate Others</h4>
                <p className="text-sm text-muted-foreground">
                  Correctly guess others' missions to eliminate them
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}