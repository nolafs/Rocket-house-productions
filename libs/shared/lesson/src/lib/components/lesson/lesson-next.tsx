'use client';
import { Button } from '@rocket-house-productions/shadcn-ui';
import { SectionModule, SectionLesson, SectionCourse } from '@rocket-house-productions/types';
import { useLessonProgressionStore, useScrollTo } from '@rocket-house-productions/providers';
import { useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/navigation';
import { Loader2Icon } from 'lucide-react';

interface LessonNextProps {
  module: SectionModule;
  lesson: SectionLesson;
  course: SectionCourse;
}

export function LessonNext({ lesson, module, course }: LessonNextProps) {
  const router = useRouter();
  const { scrollTo } = useScrollTo();
  const { getLessonCompleted, getLessonProgress } = useLessonProgressionStore(store => store);
  const [active, setActive] = useState(false);
  const hasQuiz = lesson?.questionaries?.length > 0;
  const position = module.lessons?.findIndex(l => l.id === lesson.id) || 0;
  const [firstRender, setFirstRender] = useState(true);
  const [loadingNext, setLoadingNext] = useState(false);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
    }
  }, []);

  const lessonCompleted = useMemo(() => {
    if (lesson?.id) {
      return getLessonCompleted(lesson.id);
    }
    return false;
  }, [lesson?.id, getLessonCompleted(lesson.id)]);

  useEffect(() => {
    setActive(prevState => lessonCompleted);
    if (getLessonProgress(lesson.id) === 100) {
      if (!firstRender) {
        setActive(true);
        scrollTo('continue');
      }
    }
  }, [getLessonProgress(lesson.id), lessonCompleted]);

  if (!lesson || !module || !course) {
    console.warn('LessonNext: Missing lesson, module or course');
    return null;
  }

  const nextLesson = module?.lessons?.length ? module?.lessons?.[position + 1] : null;

  const lastLessonInModule = (id: string) => {
    if (module.lessons?.length) {
      return module?.lessons[module.lessons.length - 1].id === id;
    }
    return null;
  };

  const handleQuiz = () => {
    setLoadingNext(true);
    router.push(`/courses/${course.slug}/modules/${module.slug}/lessons/${lesson.slug}/quiz`);
  };

  const handleNext = () => {
    setLoadingNext(true);
    if (!lastLessonInModule(lesson.id) && nextLesson) {
      if (nextLesson) {
        router.push(`/courses/${course.slug}/modules/${module.slug}/lessons/${nextLesson.slug}`);
      }
    } else {
      router.push(`/courses/${course.slug}`);
    }
  };

  if (hasQuiz) {
    return (
      <div
        id={'continue'}
        className={cn(
          'relative mt-10 flex w-full items-center justify-between rounded-md border border-pink-500 p-10',
          !active && 'opacity-30',
        )}
        style={{ borderColor: module.color }}>
        <div className={'font-bold'}>
          <span className={'text-pink-500'}>Quiz time</span>
        </div>
        <div>
          <Button variant={'lesson'} size={'lg'} onClick={handleQuiz} disabled={!active}>
            {loadingNext ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              'Continue'
            )}
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
        )}
        style={{ borderColor: module.color }}>
        <div className={'font-bold'}>
          <span className={'text-pink-500'}>Congratulations!</span>
        </div>
        <div>
          <Button variant={'lesson'} size={'lg'} onClick={handleNext} disabled={!active}>
            {loadingNext ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              'Continue'
            )}
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
        )}
        style={{ borderColor: module.color }}>
        <div className={'font-bold'}>
          <span className={'text-pink-500'}>Next Lesson:</span> <span>{nextLesson.title}</span>
        </div>
        <div>
          <Button variant={'lesson'} size={'lg'} onClick={handleNext} disabled={!active}>
            {loadingNext ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </div>
      </div>
    )
  );
}

export default LessonNext;
