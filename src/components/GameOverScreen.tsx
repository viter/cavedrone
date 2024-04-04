import { setGameStart } from '@/slices/gameSlice';
import { useDispatch } from 'react-redux';
import { Button } from './ui/button';
import { resetScore } from '@/slices/scoreSlice';
import { resetHorizontalSpeed } from '@/slices/horizontalSpeedSlice';
import { resetVerticalSpeed } from '@/slices/verticalSpeedSlice';
import { store } from '@/app/store';

export default function GameOverScreen({ result }: { result: string }) {
  const dispatch = useDispatch();

  if (result === 'win') {
    const dataToSave = {
      data: [
        {
          name: store.getState().game.gameState.name,
          level: store.getState().game.gameState.level,
          score: store.getState().score.value,
        },
      ],
    };
    const scores = localStorage.getItem('scores');
    if (!scores) {
      localStorage.setItem('scores', JSON.stringify(dataToSave));
    } else {
      const newData = JSON.parse(scores);
      newData.data.push(dataToSave.data[0]);
      localStorage.setItem('scores', JSON.stringify(newData));
    }
  }

  function handleOkClick() {
    dispatch(setGameStart(false));
    dispatch(resetScore());
    dispatch(resetHorizontalSpeed());
    dispatch(resetVerticalSpeed());
  }

  const header = result === 'win' ? 'You Win!' : 'Game Over';
  const text = result === 'win' ? 'congratulations' : 'the drone has been destroyed';

  return (
    <div className="flex flex-col place-items-center p-10 w-[500px] h-[500px] bg-[#5E81AC] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-md text-[#D8DEE9]">
      <p className="text-3xl font-bold">{header}</p>
      <p className="text-xl mt-10">{text}</p>
      <div className="bg-[#81A1C1] border rounded-sm py-10 px-20 my-10 text-[#ECEFF4]">
        <p className="text-2xl text-center">Your score</p>
        <p className="text-3xl text-center font-bold mt-5">{store.getState().score.value}</p>
      </div>
      <Button className="w-20" onClick={handleOkClick}>
        Ok
      </Button>
    </div>
  );
}
