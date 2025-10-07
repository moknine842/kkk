import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Target, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MissionCardProps {
  mission: {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    timeLimit?: number;
  };
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  isRevealed?: boolean;
  onComplete?: () => void;
  onReveal?: () => void;
}

export default function MissionCard({ 
  mission, 
  status, 
  isRevealed = false, 
  onComplete, 
  onReveal 
}: MissionCardProps) {
  const [showDetails, setShowDetails] = useState(isRevealed);

  const getDifficultyColor = () => {
    switch (mission.difficulty) {
      case 'easy': return 'bg-gaming-success';
      case 'medium': return 'bg-gaming-warning';
      case 'hard': return 'bg-gaming-danger';
      default: return 'bg-muted';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-gaming-success" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-gaming-danger" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-gaming-warning animate-pulse" />;
      default: return <Target className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const handleReveal = () => {
    setShowDetails(!showDetails);
    console.log(`Mission ${showDetails ? 'hidden' : 'revealed'}`);
    onReveal?.();
  };

  const handleComplete = () => {
    console.log('Mission completed');
    onComplete?.();
  };

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300",
      status === 'completed' && "ring-2 ring-gaming-success",
      status === 'failed' && "ring-2 ring-gaming-danger",
      status === 'in-progress' && "ring-2 ring-gaming-warning"
    )}>
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gaming-mission-card/20 via-transparent to-primary/5" />
      
      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <CardTitle className="text-lg font-gaming">{mission.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge 
                  variant="secondary" 
                  className={cn("text-white text-xs", getDifficultyColor())}
                >
                  {mission.difficulty}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {mission.category}
                </Badge>
                {mission.timeLimit && (
                  <Badge variant="outline" className="text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {mission.timeLimit}m
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReveal}
            data-testid="button-reveal-mission"
            className="flex-shrink-0"
          >
            {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="relative">
        {showDetails ? (
          <div className="space-y-4">
            <p className="text-foreground leading-relaxed">
              {mission.description}
            </p>
            
            {status === 'in-progress' && (
              <div className="flex gap-2">
                <Button 
                  onClick={handleComplete}
                  className="flex-1"
                  data-testid="button-complete-mission"
                >
                  Mark Complete
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleReveal}
                  data-testid="button-hide-mission"
                >
                  Hide Mission
                </Button>
              </div>
            )}
            
            {status === 'pending' && (
              <Button 
                onClick={() => console.log('Mission started')}
                className="w-full"
                data-testid="button-start-mission"
              >
                Start Mission
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Eye className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Click the eye icon to reveal your secret mission
            </p>
          </div>
        )}
      </CardContent>

      {/* Status Indicator Strip */}
      {status !== 'pending' && (
        <div className={cn(
          "absolute bottom-0 left-0 right-0 h-1",
          status === 'completed' && "bg-gaming-success",
          status === 'failed' && "bg-gaming-danger",
          status === 'in-progress' && "bg-gaming-warning"
        )} />
      )}
    </Card>
  );
}