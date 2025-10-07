import GameTimer from '../GameTimer';

export default function GameTimerExample() {
  return (
    <div className="p-8 max-w-sm mx-auto bg-background">
      <GameTimer 
        initialTime={300} // 5 minutes
        isRunning={false}
        warningThreshold={60}
        onTimeUp={() => console.log('Game time is up!')}
        onToggle={(running) => console.log('Timer toggled:', running)}
      />
    </div>
  );
}