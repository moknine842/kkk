import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useWebSocket } from '@/hooks/useWebSocket';

export function MissionEntry() {
  const [, setLocation] = useLocation();
  const { gameId } = useParams<{ gameId: string }>();
  const [missionText, setMissionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const { sendMessage } = useWebSocket((message) => {
    if (message.event === 'missions_distributed') {
      setLocation(`/game/${gameId}/play`);
    }
  });

  const submitMission = async () => {
    if (!missionText.trim()) {
      alert('Please enter a mission');
      return;
    }

    const playerId = localStorage.getItem('currentPlayerId');
    if (!playerId) {
      alert('Player ID not found');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/missions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId,
          playerId,
          missionText: missionText.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit mission');
      }

      setHasSubmitted(true);
      
    } catch (error) {
      console.error('Error submitting mission:', error);
      alert('Failed to submit mission');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Mission Submitted!</CardTitle>
            <CardDescription className="text-center">
              Waiting for other players to submit their missions...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Enter Your Mission</CardTitle>
          <CardDescription>
            Create a mission for another player to complete. Be creative but make it achievable!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mission">Your Mission</Label>
            <Textarea
              id="mission"
              placeholder="Example: Make everyone laugh at least once, Compliment 3 different people, etc."
              value={missionText}
              onChange={(e) => setMissionText(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <p className="text-sm text-gray-500">
              {missionText.length} characters
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-2">Mission Tips:</h4>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Keep it fun and appropriate</li>
              <li>• Make it observable so others can verify</li>
              <li>• Don't make it too obvious</li>
              <li>• Consider the game duration</li>
            </ul>
          </div>

          <Button 
            onClick={submitMission} 
            disabled={isSubmitting || !missionText.trim()}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Mission'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
