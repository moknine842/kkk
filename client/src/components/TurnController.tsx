import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, ArrowRight, User, Shield, Clock, AlertTriangle } from "lucide-react";

interface TurnControllerProps {
  currentPlayer: string;
  currentPlayerIndex: number;
  totalPlayers: number;
  gamePhase: 'mission-viewing' | 'mission-entry' | 'gameplay' | 'guessing';
  onPlayerReady: () => void;
  onPassDevice: () => void;
  showMissionContent?: boolean;
  missionContent?: React.ReactNode;
  timeRemaining?: number;
}

export default function TurnController({
  currentPlayer,
  currentPlayerIndex,
  totalPlayers,
  gamePhase,
  onPlayerReady,
  onPassDevice,
  showMissionContent = false,
  missionContent,
  timeRemaining
}: TurnControllerProps) {
  const [isReady, setIsReady] = useState(false);
  const [privacyConfirmed, setPrivacyConfirmed] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setIsReady(false);
    setPrivacyConfirmed(false);
    setShowContent(false);
  }, [currentPlayer]);

  const handleConfirmPrivacy = () => {
    setPrivacyConfirmed(true);
    console.log(`Privacy confirmed for ${currentPlayer}`);
  };

  const handleRevealContent = () => {
    setShowContent(true);
    console.log(`Content revealed for ${currentPlayer}`);
  };

  const handlePlayerReady = () => {
    setIsReady(true);
    console.log(`${currentPlayer} is ready to pass device`);
    onPlayerReady();
  };

  const handlePassDevice = () => {
    console.log(`Passing device from ${currentPlayer}`);
    onPassDevice();
  };

  const getPhaseTitle = () => {
    switch (gamePhase) {
      case 'mission-viewing': return 'View Your Mission';
      case 'mission-entry': return 'Enter Mission Details';
      case 'gameplay': return 'Your Turn';
      case 'guessing': return 'Make Your Guess';
      default: return 'Your Turn';
    }
  };

  const getPhaseDescription = () => {
    switch (gamePhase) {
      case 'mission-viewing': return 'Review your secret mission privately';
      case 'mission-entry': return 'Enter any required mission information';
      case 'gameplay': return 'Take your action in the game';
      case 'guessing': return 'Guess another player\'s mission';
      default: return 'Take your turn';
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: -10,
      transition: { duration: 0.2 }
    }
  };

  const pulseVariants = {
    idle: { scale: 1 },
    pulse: { 
      scale: 1.05,
      transition: { 
        duration: 1,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        data-testid="turn-controller-overlay"
      >
        <motion.div
          className="w-full max-w-md"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Card className="relative overflow-hidden border-2 border-gaming-player-highlight/30">
            <div className="absolute inset-0 bg-gradient-to-br from-gaming-player-highlight/10 via-primary/5 to-gaming-mission-card/10" />
            
            <CardHeader className="relative text-center">
              <motion.div
                className="w-16 h-16 bg-gaming-player-highlight/20 rounded-full flex items-center justify-center mx-auto mb-4"
                variants={pulseVariants}
                animate="pulse"
              >
                <User className="w-8 h-8 text-gaming-player-highlight" />
              </motion.div>
              
              <CardTitle className="text-xl font-gaming">{getPhaseTitle()}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {getPhaseDescription()}
              </p>
              
              <div className="flex items-center justify-center gap-4 mt-4">
                <Badge variant="outline" className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {currentPlayer}
                </Badge>
                <Badge variant="secondary">
                  Turn {currentPlayerIndex + 1} of {totalPlayers}
                </Badge>
                {timeRemaining && (
                  <Badge variant={timeRemaining <= 30 ? "destructive" : "outline"} className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="relative space-y-4">
              {/* Privacy Instructions */}
              {!privacyConfirmed && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gaming-warning/10 border border-gaming-warning/20 rounded-lg"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-5 h-5 text-gaming-warning" />
                    <h4 className="font-semibold text-gaming-warning">Privacy Check</h4>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Make sure other players cannot see the screen</li>
                    <li>• Look around to confirm privacy</li>
                    <li>• Keep your mission secret</li>
                  </ul>
                  <Button
                    onClick={handleConfirmPrivacy}
                    className="w-full mt-3"
                    data-testid="button-confirm-privacy"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    I'm Ready - Area is Private
                  </Button>
                </motion.div>
              )}

              {/* Mission Content Area */}
              {privacyConfirmed && showMissionContent && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {!showContent ? (
                    <div className="text-center space-y-4">
                      <div className="p-6 border-2 border-dashed border-muted rounded-lg">
                        <EyeOff className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">Your mission is hidden</p>
                        <p className="text-sm text-muted-foreground">Click below to reveal it</p>
                      </div>
                      <Button
                        onClick={handleRevealContent}
                        variant="outline"
                        className="w-full"
                        data-testid="button-reveal-mission"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Reveal My Mission
                      </Button>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {missionContent}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Action Buttons */}
              {privacyConfirmed && (!showMissionContent || showContent) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <Separator />
                  
                  {!isReady ? (
                    <Button
                      onClick={handlePlayerReady}
                      className="w-full h-12"
                      data-testid="button-player-ready"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      I'm Done - Ready to Pass Device
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-3 bg-gaming-success/10 border border-gaming-success/20 rounded-lg text-center"
                      >
                        <p className="text-sm text-gaming-success font-medium">
                          Ready to pass device to the next player
                        </p>
                      </motion.div>
                      
                      <Button
                        onClick={handlePassDevice}
                        variant="outline"
                        className="w-full h-12"
                        data-testid="button-pass-device"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Pass Device to Next Player
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Warning for Time */}
              {timeRemaining && timeRemaining <= 30 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 bg-gaming-danger/10 border border-gaming-danger/20 rounded-lg flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-gaming-danger animate-pulse" />
                  <p className="text-sm text-gaming-danger font-medium">
                    Time running out! Complete your turn quickly.
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}