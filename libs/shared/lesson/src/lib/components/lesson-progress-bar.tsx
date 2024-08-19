import { Progress } from '@rocket-house-productions/shadcn-ui';
import { cva } from 'class-variance-authority';
import { cn } from '@rocket-house-productions/util';

const progressVariants = cva('', {
  variants: {
    variant: {
      default: 'text-black',
      white: 'text-white',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export function LessonProgressBar({
  currentProgress,
  variation,
}: {
  currentProgress: number;
  variation?: 'default' | 'white';
}) {
  return (
    <div className={'flex min-w-[300px] flex-col space-x-1.5'}>
      <div className={cn('flex justify-between px-1.5 pb-2 text-sm font-bold', progressVariants)}>
        <div>Your progress</div>
        <div className={'text-pink-500'}>{Math.round(currentProgress)}%</div>
      </div>
      <Progress
        value={currentProgress}
        className={cn(
          variation !== 'white' && 'w-full outline outline-4 outline-gray-200',
          variation === 'white' && 'w-full outline outline-4 outline-white',
        )}
      />
    </div>
  );
}

export default LessonProgressBar;