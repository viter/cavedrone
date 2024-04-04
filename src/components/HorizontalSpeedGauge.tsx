import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

export default function HorizontalSpeedGauge() {
  const horizontalSpeed = useSelector((state: RootState) => state.horizontalSpeed.value);
  return (
    <div className="w-[200px]">
      <svg width={200} height={100} fill="#4C566A">
        <text x="5" y="35" fontSize={14}>
          -max
        </text>
        <text x="160" y="35" fontSize={14}>
          +max
        </text>
        <rect x={20} y={45} width={160} height={15} stroke="#4C566A" strokeWidth={1} fill="none" />
        <line x1={100} x2={100} y1={45} y2={60} stroke="#4C566A" />
        {horizontalSpeed > 0 ? (
          <rect
            x={100}
            y={45}
            width={(80 * ((100 * horizontalSpeed) / 3)) / 100}
            height={15}
            stroke="#4C566A"
            strokeWidth={1}
          />
        ) : null}
        {horizontalSpeed < 0 ? (
          <rect
            x={100 - (80 * ((100 * Math.abs(horizontalSpeed)) / 3)) / 100}
            y={45}
            width={(80 * ((100 * Math.abs(horizontalSpeed)) / 3)) / 100}
            height={15}
            stroke="#4C566A"
            strokeWidth={1}
          />
        ) : null}
      </svg>
    </div>
  );
}
