import GameModeSelector from '../GameModeSelector';

export default function GameModeSelectorExample() {
  return (
    <GameModeSelector 
      onSelectMode={(mode) => console.log('Selected mode:', mode)} 
    />
  );
}