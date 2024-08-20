'use client';
import { Button } from '@rocket-house-productions/shadcn-ui';
import { SectionModule } from '@rocket-house-productions/types';
import { Lesson } from '@prisma/client';
import { useLessonProgressionStore } from '@rocket-house-productions/providers';
import { useEffect, useState } from 'react';
import cn from 'classnames';

interface LessonNextProps {
  module?: SectionModule | null | undefined;
  lesson?: Lesson | null | undefined;
}

export function LessonNext({ lesson, module }: LessonNextProps) {
  const { lessons, getLessonProgress } = useLessonProgressionStore(store => store);
  const [active, setActive] = useState(false);
  const currentLessonNum = lesson?.position || 0;
  const nextLesson =
    (module?.lessons?.length !== currentLessonNum + 1 && module?.lessons?.[currentLessonNum + 1]) || null;

  useEffect(() => {
    if (lesson?.id) {
      if (getLessonProgress(lesson?.id) === 100) {
        setActive(true);
      }
    }
  }, [lessons]);

  if (!lesson || !module) {
    return null;
  }

  return (
    nextLesson && (
      <div
        id={'continue'}
        className={cn(
          'relative flex w-full items-center justify-between rounded-md border border-pink-500 p-10',
          !active && 'opacity-30',
        )}>
        <div className={'font-bold'}>
          <span className={'text-pink-500'}>Next Lesson:</span> <span>{nextLesson.title}</span>
        </div>
        <div>
          <Button variant={'lesson'} size={'lg'} disabled={!active}>
            Continue
          </Button>
        </div>
      </div>
    )
  );
}

export default LessonNext;
