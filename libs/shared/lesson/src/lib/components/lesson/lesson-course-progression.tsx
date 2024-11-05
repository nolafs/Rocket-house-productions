'use client';
import { useCourseProgressionStore } from '@rocket-house-productions/providers';
import LessonProgressBar from '../lesson-progress-bar';
import { Course } from '@prisma/client';

interface LessonCourseProgressionProps {
  course: Course;
}
export function LessonCourseProgression({ course }: LessonCourseProgressionProps) {
  const { currentCourseProgress } = useCourseProgressionStore(store => store);

  return (
    <div className={'mt-5 w-full md:mt-0'}>
      <LessonProgressBar currentProgress={currentCourseProgress} variation={'white'} />
    </div>
  );
}

export default LessonCourseProgression;
