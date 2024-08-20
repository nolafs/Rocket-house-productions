'use client';
import { usePointsStore } from '@rocket-house-productions/providers';

export function ScoreDisplay() {
  const { points } = usePointsStore(store => store);

  return (
    <div className={'flex flex-col space-y-1 text-white'}>
      <small className={'text-sm'}>Score</small>
      <div className={'font-lesson-heading text-border text-3xl text-pink-500'}>{points}</div>
    </div>
  );
}

export default ScoreDisplay;
