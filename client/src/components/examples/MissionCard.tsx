import MissionCard from '../MissionCard';

export default function MissionCardExample() {
  const sampleMission = {
    id: '1',
    title: 'The Subtle Compliment',
    description: 'Give someone a genuine compliment about their choice of clothing without making it obvious that this is your mission. The compliment must feel natural and be accepted graciously.',
    difficulty: 'medium' as const,
    category: 'Social',
    timeLimit: 10
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-background">
      <MissionCard 
        mission={sampleMission}
        status="in-progress"
        isRevealed={true}
        onComplete={() => console.log('Mission completed!')}
        onReveal={() => console.log('Mission visibility toggled')}
      />
    </div>
  );
}