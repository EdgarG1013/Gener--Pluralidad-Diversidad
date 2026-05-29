import { GameProvider, useGame } from './context/GameContext';
import { HomeScreen } from './components/screens/HomeScreen';
import { HowToPlayScreen } from './components/screens/HowToPlayScreen';
import { PlayerJoinScreen } from './components/screens/PlayerJoinScreen';
import { LobbyScreen } from './components/screens/LobbyScreen';
import { GameBoardScreen } from './components/screens/GameBoardScreen';
import { QuestionScreen } from './components/screens/QuestionScreen';
import { VictoryScreen } from './components/screens/VictoryScreen';
import { SpectatorScreen } from './components/screens/SpectatorScreen';

function GameRouter() {
  const { gameState } = useGame();

  switch (gameState.screen) {
    case 'home':
      return <HomeScreen />;
    case 'how-to-play':
      return <HowToPlayScreen />;
    case 'player-join':
      return <PlayerJoinScreen />;
    case 'lobby':
      return <LobbyScreen />;
    case 'game-board':
      return <GameBoardScreen />;
    case 'question':
      return <QuestionScreen />;
    case 'victory':
      return <VictoryScreen />;
    case 'spectator':
      return <SpectatorScreen />;
    default:
      return <HomeScreen />;
  }
}

export default function App() {
  return (
    <GameProvider>
      <div className="size-full">
        <GameRouter />
      </div>
    </GameProvider>
  );
}
