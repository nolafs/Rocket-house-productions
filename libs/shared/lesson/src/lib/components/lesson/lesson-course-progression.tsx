'use client';
import { useCourseProgressionStore } from '@rocket-house-productions/providers';
import LessonProgressBar from '../lesson-progress-bar';

interface LessonCourseProgressionProps {
  type: 'default' | 'radial' | 'linear';
}
export function LessonCourseProgression({ type = 'default' }: LessonCourseProgressionProps) {
  const { currentCourseProgress } = useCourseProgressionStore(store => store);

  return (
    <div className={'mt-5 w-full md:mt-0'}>
      <LessonProgressBar currentProgress={currentCourseProgress} variation={'white'} type={type} />
    </div>
  );
}

export default LessonCourseProgression;
