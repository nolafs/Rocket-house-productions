'use client';
import { Button, buttonVariants } from '@rocket-house-productions/shadcn-ui/server';
import { SectionModule, SectionLesson, SectionCourse } from '@rocket-house-productions/types';
import { useLessonProgressionStore, useModuleProgressStore, useScrollTo } from '@rocket-house-productions/providers';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/navigation';
import { ArrowBigLeftIcon, Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { logger } from '@rocket-house-productions/util';

interface LessonNextProps {
  module: SectionModule;
  lesson: SectionLesson;
  course: SectionCourse;
}

interface LessonNextWrapperProps {
  moduleColor: string;
  active: boolean;
  backUrl?: string;
  children: ReactNode;
}

const LessonNextWrapper = ({ children, moduleColor, active, backUrl = '/' }: LessonNextWrapperProps) => {
  return (
    <>
      <div
        id={'continue'}
        className={cn(
          'relative flex w-full flex-col items-center justify-between space-y-5 rounded-md border border-pink-500 p-10 md:flex-row md:space-y-0',
          !active && 'opacity-30',
        )}
        style={{ borderColor: moduleColor }}>
        {children}
      </div>
      <Link href={backUrl} className={cn(buttonVariants({ variant: 'lesson' }), 'flex md:hidden')}>
        <i>
          <ArrowBigLeftIcon className={'h-4 w-4'} />{' '}
        </i>{' '}
        Back
      </Link>
    </>
  );
};

export function LessonNext({ lesson, module, course }: LessonNextProps) {
  const router = useRouter();
  const { scrollTo } = useScrollTo();
  const { getLessonCompleted, getLessonProgress, setLessonComplete } = useLessonProgressionStore(store => store);
  const { calculateModuleProgress } = useModuleProgressStore(store => store);
  const [active, setActive] = useState(false);
  const hasQuiz = lesson?.questionaries?.length > 0;
  const position = lesson.position;
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

  const nextLesson = useMemo(() => {
    logger.debug('Calculating next lesson for position', { position, lessons: module?.lessons?.length ?? 0 });
    // Find next lesson by position (not array index) to handle unsorted arrays
    const next = module?.lessons?.find(l => l.position === position + 1);
    logger.debug('Next lesson calculated', { currentPosition: position, nextLesson: next?.title, nextPosition: next?.position });
    return next || null;
  }, [module?.lessons, position]);

  const lastLessonInModule = (id: string) => {
    if (module.lessons?.length) {
      // Find the lesson with the highest position in this module
      const maxPosition = Math.max(...module.lessons.map(l => l.position || 0));
      const currentLesson = module.lessons.find(l => l.id === id);
      return currentLesson?.position === maxPosition;
    }
    return null;
  };

  const handleQuiz = () => {
    setLoadingNext(true);
    router.push(`/courses/${course.slug}/modules/${module.slug}/lessons/${lesson.slug}/quiz`);
  };

  const handleNext = () => {
    setLoadingNext(true);
    // Ensure lesson is marked complete before navigating (safety net if video 'ended' event didn't fire)
    const isCompleted = getLessonCompleted(lesson.id);
    const progress = getLessonProgress(lesson.id);
    logger.debug('[LessonNext] handleNext called', {
      lessonId: lesson.id,
      isCompleted,
      progress,
      willMarkComplete: !isCompleted && progress >= 100,
    });

    if (!isCompleted && progress >= 100) {
      logger.info('[LessonNext] Marking lesson as complete', { lessonId: lesson.id });
      setLessonComplete(lesson.id);
      if (module.id) {
        calculateModuleProgress(module.id);
      }
    }
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
      <LessonNextWrapper moduleColor={module.color || 'black'} active={active} backUrl={`/courses/${course.slug}`}>
        <>
          <div className={'text-center font-bold md:text-left'}>
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
        </>
      </LessonNextWrapper>
    );
  }

  if (lastLessonInModule(lesson.id)) {
    return (
      <LessonNextWrapper moduleColor={module.color || 'black'} active={active} backUrl={`/courses/${course.slug}`}>
        <>
          <div className={'text-center font-bold md:text-left'}>
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
        </>
      </LessonNextWrapper>
    );
  }

  return (
    nextLesson &&
    !hasQuiz && (
      <LessonNextWrapper moduleColor={module.color || 'black'} active={active} backUrl={`/courses/${course.slug}`}>
        <>
          <div className={'text-center font-bold md:text-left'}>
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
        </>
      </LessonNextWrapper>
    )
  );
}

export default LessonNext;
