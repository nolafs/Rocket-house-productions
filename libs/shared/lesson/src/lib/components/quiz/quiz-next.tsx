'use client';
import cn from 'classnames';
import { Button } from '@rocket-house-productions/shadcn-ui/server';
import { SectionCourse, SectionLesson, SectionModule } from '@rocket-house-productions/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2Icon } from 'lucide-react';

interface QuizNextProps {
  module: SectionModule;
  lesson: SectionLesson;
  course: SectionCourse;
  quizCompleted: boolean;
}

export function QuizNext({ lesson, module, course, quizCompleted = false }: QuizNextProps) {
  const router = useRouter();
  const [loadingNext, setLoadingNext] = useState(false);

  const [active, setActive] = useState(false);
  const position = lesson.position;

  useEffect(() => {
    if (quizCompleted) {
      setActive(true);
    }
  }, [quizCompleted]);

  if (!lesson || !module || !course) {
    console.warn('[LessonNext]: Missing lesson, module or course');
    return null;
  }

  const nextLesson = module?.lessons?.find(l => l.position === position + 1);

  const lastLessonInModule = (id: string) => {
    if (module.lessons?.length) {
      return module?.lessons[module.lessons.length - 1].id === id;
    }
    return null;
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

  if (nextLesson) {
    return (
      <div
        id={'continue'}
        className={cn(
          'relative mt-10 flex w-full flex-col items-center justify-between rounded-md border border-pink-500 p-10 md:flex-row',
          !active && 'opacity-30',
        )}
        style={{ borderColor: module.color }}>
        <div className={'mb-5 text-center font-bold md:mb-0 md:text-left'}>
          <span className={'text-pink-500'} style={{ color: module.color }}>
            Next Lesson:
          </span>{' '}
          <span>{nextLesson.title}</span>
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

  if (lastLessonInModule(lesson.id)) {
    return (
      <div
        id={'continue'}
        className={cn(
          'relative mt-10 flex w-full flex-col items-center justify-between rounded-md border border-pink-500 p-10 md:flex-row',
          !active && 'opacity-30',
        )}
        style={{ borderColor: module.color }}>
        <div className={'mb-5 text-center font-bold md:mb-0 md:text-left'}>
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
}

export default QuizNext;
