import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, LogIn, Wifi } from "lucide-react";

interface OnlineModeSelectorProps {
  onBack: () => void;
  onSelectFlow: (flow: 'create' | 'join') => void;
}

export default function OnlineModeSelector({ onBack, onSelectFlow }: OnlineModeSelectorProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Mode Selection
          </Button>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <Wifi className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl font-gaming font-bold">Online Mode</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Play with friends anywhere. Choose how you want to start:
          </p>
        </div>

        {/* Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Create Lobby Card */}
          <motion.div variants={cardVariants}>
            <Card className="relative overflow-hidden hover-elevate h-full cursor-pointer group" onClick={() => onSelectFlow('create')}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-gaming-player-highlight/5 group-hover:from-primary/20 group-hover:to-gaming-player-highlight/10 transition-all" />
              
              <CardContent className="relative p-8 flex flex-col items-center text-center space-y-6 h-full">
                <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-10 h-10 text-primary" />
                </div>
                
                <div className="space-y-3 flex-1">
                  <h2 className="text-2xl font-gaming font-bold">Create Lobby</h2>
                  <p className="text-muted-foreground">
                    Start a new game and invite your friends
                  </p>
                  
                  <div className="pt-4 space-y-2 text-sm text-muted-foreground text-left">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gaming-success mt-1.5" />
                      <span>You'll be the host with full control</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gaming-success mt-1.5" />
                      <span>Customize game settings and features</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gaming-success mt-1.5" />
                      <span>Share a code with friends to join</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gaming-success mt-1.5" />
                      <span>Start the game when everyone's ready</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full h-12 text-lg font-semibold group-hover:scale-105 transition-transform"
                  onClick={() => onSelectFlow('create')}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Lobby
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Join Lobby Card */}
          <motion.div variants={cardVariants}>
            <Card className="relative overflow-hidden hover-elevate h-full cursor-pointer group" onClick={() => onSelectFlow('join')}>
              <div className="absolute inset-0 bg-gradient-to-br from-gaming-player-highlight/10 to-primary/5 group-hover:from-gaming-player-highlight/20 group-hover:to-primary/10 transition-all" />
              
              <CardContent className="relative p-8 flex flex-col items-center text-center space-y-6 h-full">
                <div className="w-20 h-20 bg-gaming-player-highlight/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LogIn className="w-10 h-10 text-gaming-player-highlight" />
                </div>
                
                <div className="space-y-3 flex-1">
                  <h2 className="text-2xl font-gaming font-bold">Join Lobby</h2>
                  <p className="text-muted-foreground">
                    Enter a code to join an existing game
                  </p>
                  
                  <div className="pt-4 space-y-2 text-sm text-muted-foreground text-left">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gaming-player-highlight mt-1.5" />
                      <span>Get the lobby code from your host</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gaming-player-highlight mt-1.5" />
                      <span>Enter your display name</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gaming-player-highlight mt-1.5" />
                      <span>Join instantly and see other players</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gaming-player-highlight mt-1.5" />
                      <span>Wait for host to start the game</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="secondary"
                  className="w-full h-12 text-lg font-semibold group-hover:scale-105 transition-transform"
                  onClick={() => onSelectFlow('join')}
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Join Existing Lobby
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Help Text */}
        <motion.div 
          variants={cardVariants}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          <p>Need help? Make sure all players have a stable internet connection for the best experience.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
