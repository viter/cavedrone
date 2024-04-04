import { Button } from './ui/button';
import { useState } from 'react';
import IntroScreen from './IntroScreen';
import ScoreTable from './ScoreTable';

export default function StartScreen() {
  const [showIntroScreen, setShowIntroScreen] = useState(false);

  return (
    <div className="w-[500px] h-[700px] bg-[#8FBCBB] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-md p-10">
      <p className="text-slate-700 text-4xl text-center font-bold">Cave Drone</p>
      {showIntroScreen ? (
        <IntroScreen />
      ) : (
        <div>
          <ScoreTable />
          <div className="flex justify-center mt-10">
            <Button onClick={() => setShowIntroScreen(true)}>Let's play</Button>
          </div>
        </div>
      )}
    </div>
  );
}
