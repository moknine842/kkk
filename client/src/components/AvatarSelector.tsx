import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Camera, 
  Palette, 
  User, 
  Check,
  X 
} from "lucide-react";
import CustomAvatarBuilder from "./CustomAvatarBuilder";
import { 
  type AvatarConfig, 
  type CustomAvatarData,
  generateInitials,
  SKIN_COLORS,
  FACE_OPTIONS,
  ACCESSORY_OPTIONS
} from "@/lib/avatarData";

interface AvatarSelectorProps {
  playerName: string;
  currentAvatar: AvatarConfig;
  onAvatarChange: (avatar: AvatarConfig) => void;
  onClose: () => void;
}

export default function AvatarSelector({ 
  playerName, 
  currentAvatar, 
  onAvatarChange,
  onClose 
}: AvatarSelectorProps) {
  const [selectedType, setSelectedType] = useState<'main' | 'custom'>('main');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAvatarChange({
          type: 'upload',
          imageUrl: reader.result as string,
        });
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAvatarChange({
          type: 'camera',
          imageUrl: reader.result as string,
        });
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomizeClick = () => {
    setSelectedType('custom');
  };

  const handleCustomSave = (customData: CustomAvatarData) => {
    onAvatarChange({
      type: 'custom',
      customData,
    });
    onClose();
  };

  const handleInitialsClick = () => {
    onAvatarChange({
      type: 'initials',
      initials: generateInitials(playerName),
    });
    onClose();
  };

  const renderCustomAvatar = (data?: CustomAvatarData) => {
    if (!data) return null;
    const face = FACE_OPTIONS.find(f => f.id === data.face);
    const skinColor = SKIN_COLORS.find(c => c.id === data.skinColor);
    const accessories = data.accessories
      .map(id => ACCESSORY_OPTIONS.find(a => a.id === id)?.emoji)
      .filter(Boolean)
      .join(' ');

    return (
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl relative"
        style={{ backgroundColor: skinColor?.color }}
      >
        <span>{face?.emoji}</span>
        {accessories && (
          <div className="absolute -top-1 -right-1 text-sm">
            {accessories}
          </div>
        )}
      </div>
    );
  };

  const getCurrentAvatarPreview = () => {
    if (currentAvatar.type === 'upload' || currentAvatar.type === 'camera') {
      return (
        <Avatar className="w-20 h-20">
          <AvatarImage src={currentAvatar.imageUrl} />
          <AvatarFallback>{currentAvatar.initials || generateInitials(playerName)}</AvatarFallback>
        </Avatar>
      );
    } else if (currentAvatar.type === 'custom' && currentAvatar.customData) {
      return (
        <div className="scale-150">
          {renderCustomAvatar(currentAvatar.customData)}
        </div>
      );
    } else {
      return (
        <Avatar className="w-20 h-20">
          <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">
            {currentAvatar.initials || generateInitials(playerName)}
          </AvatarFallback>
        </Avatar>
      );
    }
  };

  const avatarOptions = [
    {
      id: 'upload',
      title: 'Upload Photo',
      description: 'Choose from your gallery',
      icon: Upload,
      color: 'text-blue-500',
      onClick: handleUploadClick,
    },
    {
      id: 'camera',
      title: 'Take Photo',
      description: 'Use your camera',
      icon: Camera,
      color: 'text-green-500',
      onClick: handleCameraClick,
    },
    {
      id: 'customize',
      title: 'Customize Avatar',
      description: 'Build your character',
      icon: Palette,
      color: 'text-purple-500',
      onClick: handleCustomizeClick,
    },
    {
      id: 'initials',
      title: 'Use Initials',
      description: 'Simple default avatar',
      icon: User,
      color: 'text-orange-500',
      onClick: handleInitialsClick,
    },
  ];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Customize Your Avatar</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {selectedType === 'main' ? (
            <motion.div
              key="main"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Current Avatar Preview */}
              <div className="flex flex-col items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="relative">
                  {getCurrentAvatarPreview()}
                  {currentAvatar.type !== 'initials' && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gaming-success rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="font-semibold">{playerName}</p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {currentAvatar.type === 'initials' ? 'Default' : 
                     currentAvatar.type === 'upload' ? 'Uploaded' :
                     currentAvatar.type === 'camera' ? 'Camera' : 'Custom'}
                  </Badge>
                </div>
              </div>

              {/* Avatar Options */}
              <div className="grid grid-cols-2 gap-4">
                {avatarOptions.map((option) => (
                  <motion.div
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className="cursor-pointer hover-elevate transition-all"
                      onClick={option.onClick}
                    >
                      <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                        <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center ${option.color}`}>
                          <option.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{option.title}</h4>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleCameraCapture}
                className="hidden"
              />
            </motion.div>
          ) : (
            <motion.div
              key="custom"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CustomAvatarBuilder
                onSave={handleCustomSave}
                onCancel={() => setSelectedType('main')}
                initialData={currentAvatar.customData}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
