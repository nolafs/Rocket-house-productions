'use client';
import { useCourseProgressionStore } from '@rocket-house-productions/providers';
import { useEffect, useState } from 'react';
import LessonProgressBar from '../lesson-progress-bar';
import { Course } from '@prisma/client';

interface LessonCourseProgressionProps {
  course: Course;
}
export function LessonCourseProgression({ course }: LessonCourseProgressionProps) {
  const courseProgression = useCourseProgressionStore(store => store);
  const [courseProgress, setCourseProgress] = useState<number | null>(null);

  useEffect(() => {
    setCourseProgress(prevState => courseProgression.getCourseProgress(course.id));
  }, [courseProgression, course]);

  if (courseProgress !== null) {
    return <LessonProgressBar currentProgress={courseProgress} variation={'white'} />;
  }
}

export default LessonCourseProgression;
