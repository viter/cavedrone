import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

export default function Score() {
  const score = useSelector((state: RootState) => state.score.value);
  return (
    <div className="w-[80px] text-center my-auto text-slate-700">
      <p className="text-sm">Score</p>
      <p className="text-xl font-bold">{score}</p>
    </div>
  );
}
