'use client';
import { usePointsStore } from '@rocket-house-productions/providers';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef, useState } from 'react';

gsap.registerPlugin(useGSAP);

export function ScoreDisplay() {
  const { points } = usePointsStore(store => store);
  const [score, setScore] = useState<number | null>(null);
  const ref = useRef<any>();

  useGSAP(
    () => {
      if (points === score) {
        gsap.set('.count', { innerText: points });
        return;
      }

      const timeline = gsap.timeline({ paused: true });

      timeline.to('.count', {
        innerText: points,
        duration: 1,
        snap: {
          innerText: 1,
        },
      });

      timeline.play();

      setScore(points);
    },
    { scope: ref, dependencies: [points, score] },
  );

  if (score === null) {
    return null;
  }

  return (
    <div className={'flex flex-col space-y-1 text-white'} ref={ref}>
      <small className={'text-sm'}>Score</small>
      <div className={'font-lesson-heading text-border count text-3xl text-pink-500'}></div>
    </div>
  );
}

export default ScoreDisplay;
