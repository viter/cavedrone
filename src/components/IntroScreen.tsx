import { useDispatch } from 'react-redux';
import { Button } from './ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';
import { setGameLevel, setGameStart, setIsLoading, setPlayerName } from '@/slices/gameSlice';

export default function IntroScreen() {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [level, setLevel] = useState(5);
  const [error, setError] = useState(false);

  function handleStartClick() {
    if (!name.trim()) {
      setError(true);
      return;
    }
    dispatch(setPlayerName(name));
    dispatch(setGameLevel(level));
    dispatch(setGameStart(true));
    dispatch(setIsLoading(true));
  }

  return (
    <>
      <div className="mt-20 bg-[#749E9D] p-10 rounded-sm">
        <Label htmlFor="name" className="text-xl">
          What is your name?
        </Label>
        <Input
          type="text"
          id="name"
          className="mt-3 mb-8 rounded-sm text-md"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(false);
          }}
        />
        <Label className="text-xl">
          Choose difficulty level: <span className="ml-5 text-[#3B4252]">{level}</span>
        </Label>
        <div className=" flex justify-between">
          <Slider
            onValueChange={(i) => setLevel(i[0])}
            name="level"
            defaultValue={[5]}
            max={10}
            step={1}
            className="mt-5"
          />
        </div>
      </div>
      <div className="flex justify-center mt-10">
        <Button onClick={handleStartClick}>Start Game</Button>
      </div>
      {error ? (
        <div className="bg-[#BF616A] text-white mt-10 p-3 rounded-sm text-center">
          You should name yourself to fly the drone :)
        </div>
      ) : null}
    </>
  );
}
