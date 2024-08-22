'use client';
import { Button } from '@rocket-house-productions/shadcn-ui';
import { SectionModule, SectionLesson, SectionCourse } from '@rocket-house-productions/types';
import { useLessonProgressionStore, useScrollTo } from '@rocket-house-productions/providers';
import { useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/navigation';

interface LessonNextProps {
  module: SectionModule;
  lesson: SectionLesson;
  course: SectionCourse;
}

export function LessonNext({ lesson, module, course }: LessonNextProps) {
  const router = useRouter();
  const { scrollTo } = useScrollTo();
  const getLessonCompleted = useLessonProgressionStore(store => store.getLessonCompleted(lesson.id));
  const [active, setActive] = useState(false);
  const hasQuiz = lesson?.questionaries?.length > 0;
  const nextLesson =
    module.lessons?.length && lesson.position - 1 < module.lessons.length
      ? module?.lessons?.[lesson.position - 1]
      : null;

  const lastLessonInModule = (id: string) => {
    console.log('[LessonNext] lessons', module?.lessons);
    console.log('[LessonNext] lesson', lesson?.position);
    console.log('[LessonNext] id', id);
    if (module.lessons?.length) {
      return module?.lessons[module.lessons.length - 1].id === id;
    }
    return null;
  };

  const lessonCompleted = useMemo(() => {
    // Check if lesson is defined and has an id before calling getLessonCompleted
    if (lesson?.id) {
      return getLessonCompleted;
    }
    return false; // Or null/undefined based on what makes sense for your use case
  }, [lesson?.id, getLessonCompleted]);

  useEffect(() => {
    if (lesson?.id && lessonCompleted) {
      setActive(true);
      scrollTo('continue');
    }
  }, [lessonCompleted, lesson?.id, scrollTo]);

  if (!lesson || !module) {
    return null;
  }

  const handleQuiz = () => {
    console.log('handleQuiz');
    router.push(`/courses/${course.slug}/modules/${module.slug}/lessons/${lesson.slug}/quiz`);
  };

  const handleNext = () => {
    console.log('handleNext');
  };

  if (hasQuiz) {
    return (
      <div
        id={'continue'}
        className={cn(
          'relative flex w-full items-center justify-between rounded-md border border-pink-500 p-10',
          !active && 'opacity-30',
        )}>
        <div className={'font-bold'}>
          <span className={'text-pink-500'}>Quiz time</span>
        </div>
        <div>
          <Button variant={'lesson'} size={'lg'} onClick={handleQuiz} disabled={!active}>
            Continue
          </Button>
        </div>
      </div>
    );
  }

  if (lastLessonInModule(lesson.id)) {
    return (
      <div
        id={'continue'}
        className={cn(
          'relative flex w-full items-center justify-between rounded-md border border-pink-500 p-10',
          !active && 'opacity-30',
        )}>
        <div className={'font-bold'}>
          <span className={'text-pink-500'}>Congratulations!</span>
        </div>
        <div>
          <Button variant={'lesson'} size={'lg'} onClick={handleNext} disabled={!active}>
            Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    nextLesson &&
    !hasQuiz && (
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
          <Button variant={'lesson'} size={'lg'} onClick={handleNext} disabled={!active}>
            Continue
          </Button>
        </div>
      </div>
    )
  );
}

export default LessonNext;
