'use client';
import Link from 'next/link';
import cn from 'classnames';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui';
import { ArrowBigLeftIcon } from 'lucide-react';
import LessonProgressBar from '../lesson-progress-bar';
import { useLessonProgressionStore } from '@rocket-house-productions/providers';
import { useIsScrolling } from '@rocket-house-productions/hooks';

interface LessonHeaderProps {
  lessonId: string;
  url?: string;
  hasProgress?: boolean;
}

export function LessonHeader({ lessonId, url = '/courses', hasProgress = true }: LessonHeaderProps) {
  const { getLessonProgress } = useLessonProgressionStore(store => store);
  const { notAtTop } = useIsScrolling();
  return (
    <div className={cn('sticky top-[95px] z-20 bg-white py-4 md:py-8', notAtTop ? 'shadow-sm shadow-black/20' : '')}>
      <div
        className={
          'container mx-auto flex max-w-5xl flex-col px-5 md:flex-row md:items-center md:justify-between md:space-y-0'
        }>
        <Link href={url} className={cn(buttonVariants({ variant: 'lesson' }), 'hidden md:flex')}>
          <i>
            <ArrowBigLeftIcon className={'h-4 w-4'} />{' '}
          </i>{' '}
          Back
        </Link>
        {hasProgress && <LessonProgressBar currentProgress={getLessonProgress(lessonId)} />}
      </div>
    </div>
  );
}

export default LessonHeader;
