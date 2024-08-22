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
}

export function LessonHeader({ lessonId, url = '/courses' }: LessonHeaderProps) {
  const { getLessonProgress } = useLessonProgressionStore(store => store);
  const { notAtTop } = useIsScrolling();
  return (
    <div className={cn('sticky top-[95px] z-20 bg-white py-8', notAtTop ? 'shadow-sm shadow-black/20' : '')}>
      <div className={'container mx-auto flex max-w-5xl items-center justify-between px-5'}>
        <Link href={url} className={cn(buttonVariants({ variant: 'lesson' }))}>
          <i>
            <ArrowBigLeftIcon className={'h-4 w-4'} />{' '}
          </i>{' '}
          Back
        </Link>
        <LessonProgressBar currentProgress={getLessonProgress(lessonId)} />
      </div>
    </div>
  );
}

export default LessonHeader;
