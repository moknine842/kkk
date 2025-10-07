import GameResults from '../GameResults';

export default function GameResultsExample() {
  const sampleStats = {
    duration: 1234, // ~20 minutes
    totalPlayers: 6,
    missionsCompleted: 2,
    totalGuesses: 8,
    correctGuesses: 3
  };

  const samplePlayers = [
    {
      id: '1',
      name: 'Alex Chen',
      result: 'winner' as const,
      mission: 'Make someone laugh without being obvious about it',
      completedMission: true,
      correctGuesses: 2,
      incorrectGuesses: 1
    },
    {
      id: '2',
      name: 'Maria Garcia',
      result: 'survivor' as const,
      mission: 'Compliment someone\'s clothing choice',
      completedMission: false,
      correctGuesses: 1,
      incorrectGuesses: 2
    },
    {
      id: '3',
      name: 'John Smith',
      result: 'eliminated' as const,
      mission: 'Ask everyone about the weather',
      completedMission: false,
      correctGuesses: 0,
      incorrectGuesses: 3
    }
  ];

  return (
    <GameResults 
      gameStats={sampleStats}
      players={samplePlayers}
      winCondition="mission-complete"
      onPlayAgain={() => console.log('Play again clicked')}
      onReturnToMenu={() => console.log('Return to menu clicked')}
    />
  );
}