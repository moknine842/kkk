import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, Pause, RotateCcw, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameTimerProps {
  initialTime: number; // in seconds
  isRunning?: boolean;
  onTimeUp?: () => void;
  onToggle?: (running: boolean) => void;
  showControls?: boolean;
  warningThreshold?: number; // seconds when to show warning
}

export default function GameTimer({ 
  initialTime, 
  isRunning = false, 
  onTimeUp, 
  onToggle,
  showControls = true,
  warningThreshold = 60 
}: GameTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [running, setRunning] = useState(isRunning);

  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (running && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setRunning(false);
            onTimeUp?.();
            console.log('Timer finished!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [running, timeLeft, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((initialTime - timeLeft) / initialTime) * 100;
  };

  const isWarning = timeLeft <= warningThreshold && timeLeft > 0;
  const isCritical = timeLeft <= 10 && timeLeft > 0;

  const handleToggle = () => {
    const newRunning = !running;
    setRunning(newRunning);
    console.log(`Timer ${newRunning ? 'started' : 'paused'}`);
    onToggle?.(newRunning);
  };

  const handleReset = () => {
    setTimeLeft(initialTime);
    setRunning(false);
    console.log('Timer reset');
    onToggle?.(false);
  };

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300",
      isWarning && "ring-2 ring-gaming-warning",
      isCritical && "ring-2 ring-gaming-danger animate-pulse"
    )}>
      {/* Progress Bar Background */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
        <div 
          className={cn(
            "h-full transition-all duration-1000 ease-linear",
            isCritical ? "bg-gaming-danger" : 
            isWarning ? "bg-gaming-warning" : "bg-gaming-success"
          )}
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className={cn(
              "w-5 h-5",
              isCritical ? "text-gaming-danger animate-pulse" :
              isWarning ? "text-gaming-warning" : "text-muted-foreground"
            )} />
            <span className="text-sm font-medium text-muted-foreground">Game Timer</span>
          </div>
          
          {(isWarning || isCritical) && (
            <Badge 
              variant="outline" 
              className={cn(
                "animate-pulse",
                isCritical ? "border-gaming-danger text-gaming-danger" :
                "border-gaming-warning text-gaming-warning"
              )}
            >
              <AlertTriangle className="w-3 h-3 mr-1" />
              {isCritical ? "CRITICAL" : "WARNING"}
            </Badge>
          )}
        </div>

        {/* Main Timer Display */}
        <div className="text-center mb-6">
          <div className={cn(
            "text-6xl font-bold font-gaming tabular-nums transition-colors duration-300",
            isCritical ? "text-gaming-danger" :
            isWarning ? "text-gaming-warning" : "text-foreground"
          )}>
            {formatTime(timeLeft)}
          </div>
          
          <p className="text-sm text-muted-foreground mt-2">
            {timeLeft === 0 ? "Time's Up!" : 
             running ? "Game in Progress" : "Game Paused"}
          </p>
        </div>

        {/* Timer Controls */}
        {showControls && (
          <div className="flex gap-2 justify-center">
            <Button
              onClick={handleToggle}
              disabled={timeLeft === 0}
              className="flex items-center gap-2"
              data-testid={running ? "button-pause-timer" : "button-start-timer"}
            >
              {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {running ? "Pause" : "Start"}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center gap-2"
              data-testid="button-reset-timer"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        )}

        {/* Time Status */}
        <div className="mt-4 text-center">
          <div className="text-xs text-muted-foreground">
            {Math.floor((initialTime - timeLeft) / 60)}m {(initialTime - timeLeft) % 60}s elapsed • {Math.floor(timeLeft / 60)}m {timeLeft % 60}s remaining
          </div>
        </div>
      </div>
    </Card>
  );
}