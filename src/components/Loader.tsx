import { Progress } from '@/components/ui/progress';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { useEffect } from 'react';
import { resetUpdateLoad, setIsLoading } from '@/slices/gameSlice';

export default function Loader() {
  const updateLoad = useSelector((state: RootState) => state.game.gameState.loadingUpdate);
  const dispatch = useDispatch();

  useEffect(() => {
    if (updateLoad === 10) {
      dispatch(setIsLoading(false));
      dispatch(resetUpdateLoad());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateLoad]);

  return (
    <div className="w-[500px] h-[700px] bg-[#8FBCBB] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-md p-10">
      <p className="text-slate-700 text-4xl text-center font-bold">Cave Drone</p>
      <h1 className="text-slate-700 text-lg text-center mt-24 mb-10">Game is loading</h1>
      <Progress value={!updateLoad ? 10 : updateLoad * 10} max={100} />
    </div>
  );
}
