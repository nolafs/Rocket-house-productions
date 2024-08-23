import { useStopwatch } from 'react-timer-hook';
import { useEffect } from 'react';

interface QuizTimerProps {
  runTimer: boolean;
}

export function QuizTimer({ runTimer }: QuizTimerProps) {
  const { seconds, minutes, hours, start, reset, pause } = useStopwatch({ autoStart: false });

  useEffect(() => {
    if (runTimer) {
      start();
    } else {
      pause();
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
