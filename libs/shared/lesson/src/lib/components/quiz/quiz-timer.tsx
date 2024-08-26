'use client';
import { useStopwatch } from 'react-timer-hook';
import { useEffect } from 'react';

interface QuizTimerProps {
  runTimer: boolean;
  onStopAt: (time: number) => void;
}

export function QuizTimer({ runTimer, onStopAt }: QuizTimerProps) {
  const { seconds, minutes, hours, totalSeconds, start, reset, pause } = useStopwatch({ autoStart: false });

  useEffect(() => {
    if (runTimer) {
      start();
    } else {
      pause();
      onStopAt(totalSeconds);
    }

    return () => {
      pause();
    };
  }, [runTimer]);

  return (
    <>
      <span>{minutes}</span>:<span>{seconds < 10 ? `0${seconds}` : seconds}</span>
    </>
  );
}

export default QuizTimer;
