import Game from './components/Game';
import StartScreen from './components/StartScreen';
import { useSelector } from 'react-redux';
import { RootState } from './app/store';
import GameOverScreen from './components/GameOverScreen';

export default function App() {
  const startGame = useSelector((state: RootState) => state.game.gameState.start);
  const gameOver = useSelector((state: RootState) => state.game.gameState.over);
  const win = useSelector((state: RootState) => state.game.gameState.win);
  return (
    <div className="w-screen min-h-screen bg-[#434C5E]">
      {startGame ? (
        <Game />
      ) : gameOver ? (
        win ? (
          <GameOverScreen result="win" />
        ) : (
          <GameOverScreen result="loose" />
        )
      ) : (
        <StartScreen />
      )}
    </div>
  );
}
