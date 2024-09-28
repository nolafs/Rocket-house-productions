'use client';
import { useLessonProgressionStore, useModuleProgressStore } from '@rocket-house-productions/providers';

import { useEffect } from 'react';

interface LessonDataProps {
  lesson: string;
  module?: any;
}

export function LessonData({ lesson, module }: LessonDataProps) {
  const { setCurrentModule, addModule, calculateModuleProgress } = useModuleProgressStore(store => store);
  const { getLessonCompleted, setLessonComplete, updateCurrentState, setReplayCount } = useLessonProgressionStore(
    store => store,
  );

  useEffect(() => {
    setReplayCount(lesson);
  }, []);

  useEffect(() => {
    addModule(module);
    setCurrentModule(module.id);
    return () => {
      setCurrentModule(null);
    };
  }, [module, lesson, addModule, setCurrentModule]);

  useEffect(() => {
    if (getLessonCompleted(lesson)) {
      calculateModuleProgress(module.id);
      setLessonComplete(lesson);
    }
    return () => {
      updateCurrentState(lesson);
    };
  }, [getLessonCompleted]);

  return null;
}

export default LessonData;
