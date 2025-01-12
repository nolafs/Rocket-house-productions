'use client';
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
  type?: 'default' | 'radial' | 'linear';
  variation?: 'default' | 'white';
}

export const LessonProgressBar: FC<LessonProgressBarProps> = memo(
  ({ currentProgress, variation = 'default', type = 'default' }) => {
    if (type === 'radial') {
      return (
        <div className="relative h-20 w-20">
          <svg className="h-full w-full" viewBox="0 0 100 100">
            <circle className="stroke-current" strokeWidth="0" cx="50" cy="50" r="40" fill="white"></circle>
            <circle
              className="stroke-current text-white"
              strokeWidth="14"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"></circle>
            <circle
              className="stroke-current text-gray-200"
              strokeWidth="10"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"></circle>
            <circle
              className="progress-ring__circle stroke-current text-pink-500"
              strokeWidth="10"
              strokeLinecap="round"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              strokeDasharray="251.2"
              strokeDashoffset={`${251.2 - (251.2 * currentProgress) / 100}`}></circle>
            <text
              x="50"
              y="50"
              fontFamily="Verdana"
              fontSize="12"
              className={'font-bold'}
              textAnchor="middle"
              alignmentBaseline="middle">
              {Math.round(currentProgress)}%
            </text>
          </svg>

          <div className={'absolute -bottom-6 flex w-full justify-center'}>
            <div className={'rounded-full bg-pink-500 px-2 py-1 text-[8px] font-bold text-white'}>Your progress</div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="mb-4 flex w-full flex-col md:max-w-[360px] md:space-x-1.5">
          <div
            className={cn(
              'flex justify-between px-1.5 pb-2 text-sm font-bold',
              progressVariants({ variant: variation }),
            )}>
            <div className={'text-black md:text-white'}>Your progress</div>
            <div className="text-pink-500">{Math.round(currentProgress)}%</div>
          </div>
          <Progress
            value={currentProgress}
            className={cn('w-full outline outline-4', variation === 'white' ? 'outline-white' : 'outline-gray-200')}
          />
        </div>
      );
    }
  },
);

export default LessonProgressBar;
