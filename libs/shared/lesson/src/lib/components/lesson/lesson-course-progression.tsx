'use client';
import { useCourseProgressionStore, useModuleProgressStore } from '@rocket-house-productions/providers';
import { useEffect } from 'react';
import LessonProgressBar from '../lesson-progress-bar';

interface LessonCourseProgressionProps {
  course: any;
}

export function LessonCourseProgression({ course }: LessonCourseProgressionProps) {
  const { modules, setCurrentModule, calculateModuleProgress } = useModuleProgressStore(store => store);
  const { calculateCourseProgress, courses, getCourseProgress } = useCourseProgressionStore(store => store);
  useEffect(() => {
    console.log(['LESSON PROGRESSION'], modules);
    calculateCourseProgress(course.id);
    console.log(['COURSE PROGRESSION'], getCourseProgress(course.id));
    setCurrentModule(null);
  }, []);

  return (
    <div className={'fixed bottom-5 left-5'}>
      <LessonProgressBar currentProgress={50} variation={'white'} />
    </div>
  );
}

export default LessonCourseProgression;
