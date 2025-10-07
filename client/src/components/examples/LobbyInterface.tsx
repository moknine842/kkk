import LobbyInterface from '../LobbyInterface';

export default function LobbyInterfaceExample() {
  const samplePlayers = [
    { id: '1', name: 'Alex Chen', status: 'host' as const },
    { id: '2', name: 'Maria Garcia', status: 'active' as const },
    { id: '3', name: 'John Smith', status: 'active' as const },
    { id: '4', name: 'Sarah Wilson', status: 'active' as const },
  ];

  const sampleSettings = {
    maxPlayers: 8,
    gameDuration: 20,
    allowSpectators: true,
    specialFeatures: {
      missionSwitching: true,
      duoMissions: false,
      noMissionPlayers: true,
      timerVariations: false,
      secretAlliances: true
    }
  };

  return (
    <LobbyInterface 
      lobbyCode="GAME123"
      isHost={true}
      players={samplePlayers}
      gameSettings={sampleSettings}
      onUpdateSettings={(settings) => console.log('Settings updated:', settings)}
      onStartGame={() => console.log('Game started!')}
      onKickPlayer={(playerId) => console.log('Kick player:', playerId)}
    />
  );
}