import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Palette, Sparkles } from "lucide-react";
import { 
  FACE_OPTIONS, 
  SKIN_COLORS, 
  ACCESSORY_OPTIONS,
  type CustomAvatarData 
} from "@/lib/avatarData";

interface CustomAvatarBuilderProps {
  onSave: (avatarData: CustomAvatarData) => void;
  onCancel: () => void;
  initialData?: CustomAvatarData;
}

export default function CustomAvatarBuilder({ 
  onSave, 
  onCancel, 
  initialData 
}: CustomAvatarBuilderProps) {
  const [selectedFace, setSelectedFace] = useState(
    initialData?.face || FACE_OPTIONS[0].id
  );
  const [selectedSkinColor, setSelectedSkinColor] = useState(
    initialData?.skinColor || SKIN_COLORS[2].id
  );
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>(
    initialData?.accessories || []
  );

  const toggleAccessory = (accessoryId: string) => {
    if (accessoryId === 'none') {
      setSelectedAccessories([]);
      return;
    }
    
    setSelectedAccessories(prev => 
      prev.includes(accessoryId)
        ? prev.filter(id => id !== accessoryId)
        : [...prev, accessoryId]
    );
  };

  const handleSave = () => {
    onSave({
      face: selectedFace,
      skinColor: selectedSkinColor,
      accessories: selectedAccessories,
    });
  };

  const getCurrentFace = () => FACE_OPTIONS.find(f => f.id === selectedFace);
  const getCurrentSkinColor = () => SKIN_COLORS.find(c => c.id === selectedSkinColor);
  const getAccessoryEmojis = () => 
    selectedAccessories
      .map(id => ACCESSORY_OPTIONS.find(a => a.id === id)?.emoji)
      .filter(Boolean)
      .join(' ');

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div className="flex justify-center">
        <Card className="w-40 h-40 flex items-center justify-center">
          <div 
            className="w-32 h-32 rounded-full flex items-center justify-center text-6xl relative"
            style={{ backgroundColor: getCurrentSkinColor()?.color }}
          >
            <span>{getCurrentFace()?.emoji}</span>
            {selectedAccessories.length > 0 && (
              <div className="absolute -top-2 -right-2 text-3xl">
                {getAccessoryEmojis()}
              </div>
            )}
          </div>
        </Card>
      </div>

      <Separator />

      {/* Face Selection */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Choose Face Expression
        </Label>
        <div className="grid grid-cols-4 gap-2">
          {FACE_OPTIONS.map((face) => (
            <motion.button
              key={face.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedFace(face.id)}
              className={`
                p-3 rounded-lg border-2 transition-all
                ${selectedFace === face.id 
                  ? 'border-primary bg-primary/10' 
                  : 'border-muted hover:border-primary/50'
                }
              `}
            >
              <div className="text-3xl">{face.emoji}</div>
              <div className="text-xs mt-1 text-muted-foreground">{face.label}</div>
            </motion.button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Skin Color Selection */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Choose Skin Color
        </Label>
        <div className="grid grid-cols-6 gap-2">
          {SKIN_COLORS.map((skin) => (
            <motion.button
              key={skin.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedSkinColor(skin.id)}
              className={`
                w-12 h-12 rounded-full border-4 transition-all
                ${selectedSkinColor === skin.id 
                  ? 'border-primary ring-2 ring-primary/50' 
                  : 'border-muted hover:border-primary/50'
                }
              `}
              style={{ backgroundColor: skin.color }}
              title={skin.label}
            />
          ))}
        </div>
      </div>

      <Separator />

      {/* Accessories Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Add Accessories (Optional)</Label>
          {selectedAccessories.length > 0 && (
            <Badge variant="secondary">{selectedAccessories.length} selected</Badge>
          )}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {ACCESSORY_OPTIONS.map((accessory) => (
            <motion.button
              key={accessory.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleAccessory(accessory.id)}
              className={`
                p-3 rounded-lg border-2 transition-all
                ${selectedAccessories.includes(accessory.id) || (accessory.id === 'none' && selectedAccessories.length === 0)
                  ? 'border-primary bg-primary/10' 
                  : 'border-muted hover:border-primary/50'
                }
              `}
            >
              <div className="text-2xl">{accessory.emoji || '∅'}</div>
              <div className="text-xs mt-1 text-muted-foreground">{accessory.label}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSave} className="flex-1">
          Save Avatar
        </Button>
      </div>
    </div>
  );
}
