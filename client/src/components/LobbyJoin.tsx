import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogIn, ArrowLeft, Users, Wifi, AlertCircle, Edit } from "lucide-react";
import AvatarSelector from "./AvatarSelector";
import { type AvatarConfig, createDefaultAvatar, SKIN_COLORS, FACE_OPTIONS, ACCESSORY_OPTIONS } from "@/lib/avatarData";

interface LobbyJoinProps {
  onJoinLobby: (lobbyCode: string, playerName: string, avatar: AvatarConfig) => void;
  onBack: () => void;
  isJoining?: boolean;
  error?: string;
}

export default function LobbyJoin({ onJoinLobby, onBack, isJoining = false, error }: LobbyJoinProps) {
  const [lobbyCode, setLobbyCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [avatar, setAvatar] = useState<AvatarConfig>(createDefaultAvatar(""));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lobbyCode.trim() && playerName.trim()) {
      console.log('Joining lobby:', { lobbyCode, playerName, avatar });
      onJoinLobby(lobbyCode.trim().toUpperCase(), playerName.trim(), avatar);
    }
  };

  const formatLobbyCode = (value: string) => {
    // Auto-format as user types: ABC123 -> ABC123
    return value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 6);
  };

  const isValid = lobbyCode.length >= 4 && playerName.length >= 2;

  const handleNameChange = (name: string) => {
    setPlayerName(name);
    if (avatar.type === 'initials') {
      setAvatar(createDefaultAvatar(name));
    }
  };

  const renderAvatarPreview = () => {
    if (avatar.type === 'upload' || avatar.type === 'camera') {
      return (
        <Avatar className="w-20 h-20">
          <AvatarImage src={avatar.imageUrl} />
          <AvatarFallback>{avatar.initials || playerName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      );
    } else if (avatar.type === 'custom' && avatar.customData) {
      const face = FACE_OPTIONS.find(f => f.id === avatar.customData!.face);
      const skinColor = SKIN_COLORS.find(c => c.id === avatar.customData!.skinColor);
      const accessories = avatar.customData!.accessories
        .map(id => ACCESSORY_OPTIONS.find(a => a.id === id)?.emoji)
        .filter(Boolean)
        .join(' ');

      return (
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center text-5xl relative"
          style={{ backgroundColor: skinColor?.color }}
        >
          <span>{face?.emoji}</span>
          {accessories && (
            <div className="absolute -top-2 -right-2 text-2xl">
              {accessories}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <Avatar className="w-20 h-20">
          <AvatarFallback className="bg-primary/20 text-primary text-3xl font-bold">
            {avatar.initials || playerName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      );
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-md"
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
                data-testid="button-back"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <CardTitle className="text-xl font-gaming">Join Game</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Enter the lobby code to join an existing game
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Lobby Code Input */}
              <div className="space-y-2">
                <Label htmlFor="lobby-code">Lobby Code</Label>
                <Input
                  id="lobby-code"
                  placeholder="Enter 6-character code..."
                  value={lobbyCode}
                  onChange={(e) => setLobbyCode(formatLobbyCode(e.target.value))}
                  className="text-center text-lg font-gaming tracking-wider"
                  maxLength={6}
                  data-testid="input-lobby-code"
                />
                <p className="text-xs text-muted-foreground text-center">
                  Example: GAME23, FUN456, PARTY1
                </p>
              </div>

              <Separator />

              {/* Avatar & Player Name */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {renderAvatarPreview()}
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full"
                      onClick={() => setShowAvatarSelector(true)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="player-name">Your Name</Label>
                    <Input
                      id="player-name"
                      placeholder="Enter your display name..."
                      value={playerName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      maxLength={20}
                      data-testid="input-player-name"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Click the edit button to customize your avatar
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-2 p-3 bg-gaming-danger/10 rounded-lg border border-gaming-danger/20">
                  <AlertCircle className="w-4 h-4 text-gaming-danger flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gaming-danger">Join Failed</p>
                    <p className="text-xs text-gaming-danger/80">{error}</p>
                  </div>
                </div>
              )}

              {/* Join Button */}
              <Button
                type="submit"
                disabled={!isValid || isJoining}
                className="w-full h-12 text-lg"
                data-testid="button-join-lobby"
              >
                {isJoining ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Joining Game...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Join Game
                  </>
                )}
              </Button>
            </form>

            <Separator />

            {/* Help Information */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">How to Join:</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary-foreground text-xs font-bold">1</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Get the lobby code from the game host
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gaming-player-highlight rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enter the code and choose your display name
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gaming-success rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Wait for the host to start the game
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Join Options */}
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wifi className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Quick Join Tips</span>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>• Lobby codes are case-insensitive</p>
                <p>• Games need 4+ players to start</p>
                <p>• You can change your name in the lobby</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Avatar Selector Dialog */}
      {showAvatarSelector && (
        <AvatarSelector
          playerName={playerName || "Player"}
          currentAvatar={avatar}
          onAvatarChange={setAvatar}
          onClose={() => setShowAvatarSelector(false)}
        />
      )}
    </div>
  );
}