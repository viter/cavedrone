import HorizontalSpeedGauge from './HorizontalSpeedGauge';
import Score from './Score';
//import Score from './Score';
import VerticalSpeedGauge from './VerticalSpeedGauge';

export default function Gauges() {
  return (
    <div className="flex justify-between max-w-[500px]">
      <HorizontalSpeedGauge />
      <Score />
      <VerticalSpeedGauge />
    </div>
  );
}
