'use client';
import { usePointsStore } from '@rocket-house-productions/providers';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef, useState } from 'react';

gsap.registerPlugin(useGSAP);

export function ScoreDisplay() {
  const { points } = usePointsStore(store => store);
  const [score, setScore] = useState<number>(0);
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (ref.current === null) {
        return;
      }

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

  return (
    <div ref={ref} className={'flex flex-col space-y-1 text-white'}>
      <small className={'text-sm'}>Score</small>
      <div className={'font-lesson-heading text-border count text-3xl text-pink-500'}></div>
    </div>
  );
}

export default ScoreDisplay;
