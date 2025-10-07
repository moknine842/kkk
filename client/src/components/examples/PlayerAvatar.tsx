import PlayerAvatar from '../PlayerAvatar';

export default function PlayerAvatarExample() {
  return (
    <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-4 bg-background">
      <PlayerAvatar 
        id="1"
        name="Alex Chen"
        status="host"
        isCurrentPlayer={true}
        onClick={() => console.log('Clicked Alex')}
      />
      <PlayerAvatar 
        id="2"
        name="Maria Garcia"
        status="active"
        incorrectGuesses={1}
        onClick={() => console.log('Clicked Maria')}
      />
      <PlayerAvatar 
        id="3"
        name="John Smith"
        status="completed"
        onClick={() => console.log('Clicked John')}
      />
      <PlayerAvatar 
        id="4"
        name="Sarah Wilson"
        status="eliminated"
        incorrectGuesses={3}
        onClick={() => console.log('Clicked Sarah')}
      />
    </div>
  );
}