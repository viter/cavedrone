import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

export default function VerticalSpeedGauge() {
  const verticalSpeed = useSelector((state: RootState) => state.verticalSpeed.value);
  return (
    <div className="w-[200px]">
      <svg width={200} height={100} fill="#4C566A">
        <text x="15" y="35" fontSize={14}>
          0
        </text>
        <text x="160" y="35" fontSize={14}>
          max
        </text>
        <rect x={20} y={45} width={160} height={15} stroke="#4C566A" strokeWidth={1} fill="none" />
        {verticalSpeed > 0 ? (
          <rect
            x={20}
            y={45}
            width={(160 * ((100 * verticalSpeed) / 10)) / 100}
            height={15}
            stroke="#4C566A"
            strokeWidth={1}
          />
        ) : null}
      </svg>
    </div>
  );
}
