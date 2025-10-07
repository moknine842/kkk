import GuessInterface from '../GuessInterface';

export default function GuessInterfaceExample() {
  const samplePlayers = [
    { id: '1', name: 'Alex Chen', status: 'host' as const },
    { id: '2', name: 'Maria Garcia', status: 'active' as const },
    { id: '3', name: 'John Smith', status: 'completed' as const },
    { id: '4', name: 'Sarah Wilson', status: 'active' as const },
    { id: '5', name: 'Mike Johnson', status: 'eliminated' as const },
  ];

  return (
    <div className="p-8 max-w-2xl mx-auto bg-background">
      <GuessInterface 
        players={samplePlayers}
        currentPlayerId="1"
        incorrectGuesses={1}
        maxIncorrectGuesses={3}
        onSubmitGuess={(playerId, mission) => 
          console.log('Guess submitted:', { playerId, mission })
        }
      />
    </div>
  );
}