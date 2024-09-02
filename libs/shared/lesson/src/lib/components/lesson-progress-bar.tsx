import { Progress } from '@rocket-house-productions/shadcn-ui';
import { cva } from 'class-variance-authority';
import { cn } from '@rocket-house-productions/util';
import React, { FC, memo } from 'react';

const progressVariants = cva('text-black', {
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

interface LessonProgressBarProps {
  currentProgress: number;
  variation?: 'default' | 'white';
}

export const LessonProgressBar: FC<LessonProgressBarProps> = memo(({ currentProgress, variation = 'default' }) => {
  return (
    <div className="mb-4 flex w-full flex-col md:max-w-[360px] md:space-x-1.5">
      <div
        className={cn('flex justify-between px-1.5 pb-2 text-sm font-bold', progressVariants({ variant: variation }))}>
        <div>Your progress</div>
        <div className="text-pink-500">{Math.round(currentProgress)}%</div>
      </div>
      <Progress
        value={currentProgress}
        className={cn('w-full outline outline-4', variation === 'white' ? 'outline-white' : 'outline-gray-200')}
      />
    </div>
  );
});

export default LessonProgressBar;
