import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Wifi, Crown, Settings, Users, Timer, Plus, Edit } from "lucide-react";
import AvatarSelector from "./AvatarSelector";
import { type AvatarConfig, createDefaultAvatar, SKIN_COLORS, FACE_OPTIONS, ACCESSORY_OPTIONS } from "@/lib/avatarData";

interface OnlineLobbyCreateProps {
  onBack: () => void;
  onCreateLobby: (hostName: string, settings: LobbySettings, avatar: AvatarConfig) => void;
}

interface LobbySettings {
  maxPlayers: number;
  gameDuration: number;
  allowSpectators: boolean;
  specialFeatures: {
    missionSwitching: boolean;
    duoMissions: boolean;
    noMissionPlayers: boolean;
    timerVariations: boolean;
    secretAlliances: boolean;
  };
}

export default function OnlineLobbyCreate({ onBack, onCreateLobby }: OnlineLobbyCreateProps) {
  const [hostName, setHostName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [avatar, setAvatar] = useState<AvatarConfig>(createDefaultAvatar(""));
  const [settings, setSettings] = useState<LobbySettings>({
    maxPlayers: 8,
    gameDuration: 20,
    allowSpectators: true,
    specialFeatures: {
      missionSwitching: false,
      duoMissions: false,
      noMissionPlayers: false,
      timerVariations: true,
      secretAlliances: false,
    }
  });

  const handleCreateLobby = () => {
    if (hostName.trim()) {
      setIsCreating(true);
      console.log('Creating online lobby:', { hostName: hostName.trim(), settings, avatar });
      setTimeout(() => {
        onCreateLobby(hostName.trim(), settings, avatar);
      }, 1500);
    }
  };

  const updateSpecialFeature = (feature: keyof typeof settings.specialFeatures, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      specialFeatures: {
        ...prev.specialFeatures,
        [feature]: value
      }
    }));
  };

  const canCreate = hostName.trim().length >= 2;

  const handleNameChange = (name: string) => {
    setHostName(name);
    if (avatar.type === 'initials') {
      setAvatar(createDefaultAvatar(name));
    }
  };

  const renderAvatarPreview = () => {
    if (avatar.type === 'upload' || avatar.type === 'camera') {
      return (
        <Avatar className="w-20 h-20">
          <AvatarImage src={avatar.imageUrl} />
          <AvatarFallback>{avatar.initials || hostName.substring(0, 2).toUpperCase()}</AvatarFallback>
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
            {avatar.initials || hostName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      );
    }
  };

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

  const featureVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
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
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-gaming-player-highlight/10" />
          
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Wifi className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-gaming">Create Online Lobby</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Set up a new game for remote players
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative space-y-6">
            {/* Avatar & Host Name */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {renderAvatarPreview()}
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full"
                    onClick={() => setShowAvatarSelector(true)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="host-name">Your Name (Host)</Label>
                  <div className="relative">
                    <Input
                      id="host-name"
                      placeholder="Enter your display name..."
                      value={hostName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      maxLength={20}
                      data-testid="input-host-name"
                      className="pl-10"
                    />
                    <Crown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gaming-warning" />
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Click the edit button to customize your avatar
              </p>
            </motion.div>

            <Separator />

            {/* Basic Settings */}
            <motion.div variants={itemVariants} className="space-y-4">
              <Label className="text-base font-medium">Basic Settings</Label>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Max Players</Label>
                  <Select 
                    value={settings.maxPlayers.toString()} 
                    onValueChange={(value) => setSettings(prev => ({ ...prev, maxPlayers: parseInt(value) }))}
                  >
                    <SelectTrigger data-testid="select-max-players">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4 Players</SelectItem>
                      <SelectItem value="6">6 Players</SelectItem>
                      <SelectItem value="8">8 Players</SelectItem>
                      <SelectItem value="10">10 Players</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Game Duration</Label>
                  <Select 
                    value={settings.gameDuration.toString()} 
                    onValueChange={(value) => setSettings(prev => ({ ...prev, gameDuration: parseInt(value) }))}
                  >
                    <SelectTrigger data-testid="select-game-duration">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="20">20 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                <div className="space-y-1">
                  <Label>Allow Spectators</Label>
                  <p className="text-xs text-muted-foreground">Let others watch without playing</p>
                </div>
                <Switch
                  checked={settings.allowSpectators}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowSpectators: checked }))}
                  data-testid="switch-allow-spectators"
                />
              </div>
            </motion.div>

            <Separator />

            {/* Special Features */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-primary" />
                <Label className="text-base font-medium">Special Game Features</Label>
                <Badge variant="outline" className="text-xs">Optional</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Enable special gameplay mechanics to spice up your game
              </p>

              <div className="space-y-3">
                {[
                  {
                    key: 'missionSwitching' as const,
                    title: 'Mission Switching',
                    description: 'Players can swap missions with others during gameplay'
                  },
                  {
                    key: 'duoMissions' as const,
                    title: 'Duo Missions',
                    description: 'Some missions require collaboration between two players'
                  },
                  {
                    key: 'noMissionPlayers' as const,
                    title: 'No Mission Players',
                    description: 'Some players have no mission and must eliminate others'
                  },
                  {
                    key: 'timerVariations' as const,
                    title: 'Timer Variations',
                    description: 'Dynamic time limits that change based on game events'
                  },
                  {
                    key: 'secretAlliances' as const,
                    title: 'Secret Alliances',
                    description: 'Hidden team formations revealed during the game'
                  }
                ].map((feature) => (
                  <motion.div
                    key={feature.key}
                    variants={featureVariants}
                    className="flex items-center justify-between p-3 bg-card rounded-lg hover-elevate"
                  >
                    <div className="space-y-1">
                      <Label>{feature.title}</Label>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                    <Switch
                      checked={settings.specialFeatures[feature.key]}
                      onCheckedChange={(checked) => updateSpecialFeature(feature.key, checked)}
                      data-testid={`switch-${feature.key.replace(/([A-Z])/g, '-$1').toLowerCase()}`}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <Separator />

            {/* Create Lobby Button */}
            <motion.div variants={itemVariants}>
              {canCreate ? (
                <Button
                  onClick={handleCreateLobby}
                  disabled={isCreating}
                  className="w-full h-12 text-lg font-semibold"
                  data-testid="button-create-lobby"
                >
                  {isCreating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Creating Lobby...
                    </div>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Create Lobby
                    </>
                  )}
                </Button>
              ) : (
                <Button disabled className="w-full h-12">
                  <Users className="w-5 h-5 mr-2" />
                  Enter Your Name to Continue
                </Button>
              )}
            </motion.div>

            {/* Preview */}
            <motion.div variants={itemVariants} className="p-4 bg-gaming-mission-card/10 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Game Preview:</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• {settings.maxPlayers} player maximum</p>
                <p>• {settings.gameDuration} minute games</p>
                <p>• {Object.values(settings.specialFeatures).filter(Boolean).length} special features enabled</p>
                {settings.allowSpectators && <p>• Spectators welcome</p>}
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Avatar Selector Dialog */}
      {showAvatarSelector && (
        <AvatarSelector
          playerName={hostName || "Player"}
          currentAvatar={avatar}
          onAvatarChange={setAvatar}
          onClose={() => setShowAvatarSelector(false)}
        />
      )}
    </div>
  );
}