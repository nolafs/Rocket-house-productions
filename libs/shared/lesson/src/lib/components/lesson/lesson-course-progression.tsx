'use client';
import { useCourseProgressionStore, useModuleProgressStore } from '@rocket-house-productions/providers';
import { useEffect, useMemo, useState } from 'react';
import LessonProgressBar from '../lesson-progress-bar';

interface LessonCourseProgressionProps {
  course: any;
}

export function LessonCourseProgression({ course }: LessonCourseProgressionProps) {
  const { setCurrentModule } = useModuleProgressStore(store => store);
  const { calculateCourseProgress, getCourseProgress, addCourse } = useCourseProgressionStore(store => store);
  const [courseProgress, setCourseProgress] = useState(0);
  useMemo(() => {
    addCourse(course);
  }, [course]);

  useEffect(() => {
    calculateCourseProgress(course.id);
    setCourseProgress(prevState => getCourseProgress(course.id));
    setCurrentModule(null);
  }, []);

  return (
    <div className={'fixed bottom-5 left-5'}>
      <LessonProgressBar currentProgress={courseProgress} variation={'white'} />
    </div>
  );
}

export default LessonCourseProgression;
