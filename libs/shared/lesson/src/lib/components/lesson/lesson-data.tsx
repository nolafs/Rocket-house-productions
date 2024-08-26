'use client';
import { useLessonProgressionStore, useModuleProgressStore } from '@rocket-house-productions/providers';

import { useEffect } from 'react';

interface LessonDataProps {
  lesson: string;
  module?: any;
}

export function LessonData({ lesson, module }: LessonDataProps) {
  const { setCurrentModule, addModule, calculateModuleProgress } = useModuleProgressStore(store => store);
  const { getLessonProgress, getLessonCompleted, setLessonComplete, updateCurrentState } = useLessonProgressionStore(
    store => store,
  );

  useEffect(() => {
    addModule(module);
    setCurrentModule(module.id);

    return () => {
      setCurrentModule(null);
    };
  }, [module]);

  useEffect(() => {
    console.log('LESSON DATA', lesson, getLessonProgress(lesson));

    if (getLessonCompleted(lesson)) {
      calculateModuleProgress(module.id);
      setLessonComplete(lesson);
    }

    return () => {
      updateCurrentState(lesson);
    };
  }, [getLessonCompleted(lesson)]);

  return null;
}

export default LessonData;
