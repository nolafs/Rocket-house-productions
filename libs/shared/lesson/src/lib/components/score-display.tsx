export function ScoreDisplay({ score }: { score: number }) {
  return (
    <div className={'flex flex-col space-y-1 text-white'}>
      <small className={'text-sm'}>Score</small>
      <div className={'font-lesson-heading text-border text-3xl text-pink-500'}>{score}</div>
    </div>
  );
}

export default ScoreDisplay;
