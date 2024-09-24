'use client';
import { useCourseProgressionStore, useModuleProgressStore } from '@rocket-house-productions/providers';
import { useEffect, useMemo, useState } from 'react';
import LessonProgressBar from '../lesson-progress-bar';

interface LessonCourseProgressionProps {
  course: any;
}

export function LessonCourseProgression({ course }: LessonCourseProgressionProps) {
  const { setCurrentModule, modules } = useModuleProgressStore(store => store);
  const { calculateCourseProgress, getCourseProgress, addCourse } = useCourseProgressionStore(store => store);
  const [courseProgress, setCourseProgress] = useState<number | null>(null);

  useMemo(() => {
    addCourse(course);
  }, [course]);

  useEffect(() => {
    if (course.id) {
      calculateCourseProgress(course.id);
      setCourseProgress(prevState => getCourseProgress(course.id));
      setCurrentModule(null);
    }
  }, [modules, calculateCourseProgress, getCourseProgress, setCurrentModule, course.id]);

  if (courseProgress !== null) {
    return <LessonProgressBar currentProgress={courseProgress} variation={'white'} />;
  }
}

export default LessonCourseProgression;
