import LobbyJoin from '../LobbyJoin';

export default function LobbyJoinExample() {
  return (
    <LobbyJoin 
      onJoinLobby={(code, name) => console.log('Joining lobby:', { code, name })}
      onBack={() => console.log('Going back')}
      isJoining={false}
      error=""
    />
  );
}