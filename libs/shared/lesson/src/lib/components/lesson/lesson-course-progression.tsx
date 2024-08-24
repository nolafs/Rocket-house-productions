'use client';
import { useModuleProgressStore } from '@rocket-house-productions/providers';
import { useEffect } from 'react';
import LessonProgressBar from '../lesson-progress-bar';

export function LessonCourseProgression() {
  const { modules, setCurrentModule } = useModuleProgressStore(store => store);

  useEffect(() => {
    console.log(modules);
    setCurrentModule(null);
  }, []);

  return (
    <div className={'fixed bottom-5 left-5'}>
      <LessonProgressBar currentProgress={50} variation={'white'} />
    </div>
  );
}

export default LessonCourseProgression;
