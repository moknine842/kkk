import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Crown, Skull, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { type AvatarConfig, SKIN_COLORS, FACE_OPTIONS, ACCESSORY_OPTIONS } from "@/lib/avatarData";

interface PlayerAvatarProps {
  id: string;
  name: string;
  avatar?: string;
  avatarConfig?: AvatarConfig;
  status: 'active' | 'eliminated' | 'completed' | 'host';
  isCurrentPlayer?: boolean;
  incorrectGuesses?: number;
  maxIncorrectGuesses?: number;
  onClick?: () => void;
}

export default function PlayerAvatar({ 
  id, 
  name, 
  avatar, 
  avatarConfig,
  status, 
  isCurrentPlayer = false,
  incorrectGuesses = 0,
  maxIncorrectGuesses = 3,
  onClick 
}: PlayerAvatarProps) {
  
  const renderAvatar = () => {
    // If avatarConfig is provided, render based on type
    if (avatarConfig) {
      if (avatarConfig.type === 'upload' || avatarConfig.type === 'camera') {
        return (
          <Avatar className="w-12 h-12">
            <AvatarImage src={avatarConfig.imageUrl} alt={name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
        );
      } else if (avatarConfig.type === 'custom' && avatarConfig.customData) {
        const face = FACE_OPTIONS.find(f => f.id === avatarConfig.customData!.face);
        const skinColor = SKIN_COLORS.find(c => c.id === avatarConfig.customData!.skinColor);
        const accessories = avatarConfig.customData!.accessories
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
              <div className="absolute -top-0.5 -right-0.5 text-xs">
                {accessories}
              </div>
            )}
          </div>
        );
      } else {
        // Initials type
        return (
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {avatarConfig.initials || name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
        );
      }
    }
    
    // Fallback to old avatar prop
    return (
      <Avatar className="w-12 h-12">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
          {name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </AvatarFallback>
      </Avatar>
    );
  };
  
  const getStatusColor = () => {
    switch (status) {
      case 'host': return 'ring-gaming-warning';
      case 'active': return 'ring-gaming-player-highlight';
      case 'completed': return 'ring-gaming-success';
      case 'eliminated': return 'ring-gaming-danger';
      default: return 'ring-muted';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'host': return <Crown className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'eliminated': return <Skull className="w-3 h-3" />;
      case 'active': return <Clock className="w-3 h-3" />;
      default: return null;
    }
  };

  const handleClick = () => {
    console.log(`Player ${name} clicked`);
    onClick?.();
  };

  return (
    <Card 
      className={cn(
        "p-4 hover-elevate transition-all duration-200",
        isCurrentPlayer && "bg-primary/5 border-primary",
        status === 'eliminated' && "opacity-60 grayscale",
        onClick && "cursor-pointer"
      )}
      onClick={handleClick}
      data-testid={`player-${id}`}
    >
      <div className="flex flex-col items-center space-y-3">
        {/* Avatar with Status Ring */}
        <div className={cn("relative p-1 rounded-full ring-2", getStatusColor())}>
          {renderAvatar()}
          
          {/* Status Badge */}
          {status === 'host' && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gaming-warning rounded-full flex items-center justify-center">
              <Crown className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Player Name */}
        <div className="text-center">
          <h4 className={cn(
            "font-semibold text-sm",
            status === 'eliminated' && "line-through"
          )}>
            {name}
          </h4>
          {isCurrentPlayer && (
            <Badge variant="outline" className="text-xs mt-1">You</Badge>
          )}
        </div>

        {/* Status Information */}
        <div className="flex flex-col items-center space-y-1">
          {status !== 'eliminated' && incorrectGuesses > 0 && (
            <div className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-gaming-warning" />
              <span className="text-xs text-muted-foreground">
                {incorrectGuesses}/{maxIncorrectGuesses} wrong
              </span>
            </div>
          )}
          
          <Badge 
            variant={status === 'active' ? 'secondary' : status === 'completed' ? 'default' : 'outline'}
            className="text-xs flex items-center gap-1"
          >
            {getStatusIcon()}
            <span className="capitalize">{status}</span>
          </Badge>
        </div>
      </div>
    </Card>
  );
}