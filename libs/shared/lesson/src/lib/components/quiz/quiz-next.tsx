'use client';
import cn from 'classnames';
import { Button } from '@rocket-house-productions/shadcn-ui';
import { SectionCourse, SectionLesson, SectionModule } from '@rocket-house-productions/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface QuizNextProps {
  module: SectionModule;
  lesson: SectionLesson;
  course: SectionCourse;
  quizCompleted: boolean;
}

export function QuizNext({ lesson, module, course, quizCompleted = false }: QuizNextProps) {
  const router = useRouter();
  const [active, setActive] = useState(false);

  const next =
    module.lessons?.length && lesson.position < module.lessons.length ? module?.lessons?.[lesson.position + 1] : null;

  const lastLessonModule = module.lessons?.length === lesson.position;

  const handleNext = () => {
    console.log('handleNext');
    if (!lastLessonModule) {
      if (next) {
        router.push(`/courses/${course.slug}/modules/${module.slug}/lessons/${next.slug}`);
      }
    } else {
      router.push(`/courses/${course.slug}`);
    }
  };

  useEffect(() => {
    if (quizCompleted) {
      setActive(true);
    }
  }, [quizCompleted]);

  if (next) {
    return (
      <div
        id={'continue'}
        className={cn(
          'relative mt-10 flex w-full items-center justify-between rounded-md border border-pink-500 p-10',
          !active && 'opacity-30',
        )}
        style={{ borderColor: module.color }}>
        <div className={'font-bold'}>
          <span className={'text-pink-500'} style={{ color: module.color }}>
            Next Lesson:
          </span>{' '}
          <span>{next.title}</span>
        </div>
        <div>
          <Button variant={'lesson'} size={'lg'} onClick={handleNext} disabled={!active}>
            Continue
          </Button>
        </div>
      </div>
    );
  }
}

export default QuizNext;
