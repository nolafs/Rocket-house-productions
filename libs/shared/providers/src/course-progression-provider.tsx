'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore as useZustandStore } from 'zustand';

import {
  createLessonStore,
  LessonProgressStore,
  createPointsStore,
  PointsStore,
} from '@rocket-house-productions/store';

type CombinedStores = {
  lessonStore: ReturnType<typeof createLessonStore>;
  pointsStore: ReturnType<typeof createPointsStore>;
  //moduleStore: ReturnType<typeof useModuleStore>;
  //courseStore: ReturnType<typeof useCourseStore>;
  //pointsStore: ReturnType<typeof usePointsStore>;
};

const CourseProgressionContext = createContext<CombinedStores | undefined>(undefined);

export const CourseProgressionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const lessonStoreRef = useRef<CombinedStores['lessonStore']>();
  const pointsStoreRef = useRef<CombinedStores['pointsStore']>();
  //const moduleStoreRef = useRef(useModuleStore);
  //const courseStoreRef = useRef(useCourseStore);
  //const pointsStoreRef = useRef(usePointsStore);

  if (!lessonStoreRef.current) {
    lessonStoreRef.current = createLessonStore();
  }

  if (!pointsStoreRef.current) {
    pointsStoreRef.current = createPointsStore();
  }

  return (
    <CourseProgressionContext.Provider
      value={{
        lessonStore: lessonStoreRef.current,
        pointsStore: pointsStoreRef.current,
        //moduleStore: moduleStoreRef.current,
        //courseStore: courseStoreRef.current,
      }}>
      {children}
    </CourseProgressionContext.Provider>
  );
};

export const useLessonProgressionStore = <T,>(selector: (store: LessonProgressStore) => T): T => {
  const context = useContext(CourseProgressionContext);
  if (!context) {
    throw new Error(`useLessonProgressionStore must be used within CourseProgressionProvider`);
  }
  return useZustandStore(context.lessonStore, selector);
};

export const usePointsStore = <T,>(selector: (store: PointsStore) => T): T => {
  const context = useContext(CourseProgressionContext);
  if (!context) {
    throw new Error(`usePointsProgressionStore must be used within CourseProgressionProvider`);
  }
  return useZustandStore(context.pointsStore, selector);
};

/*

export const useModuleProgressionStore = <T,>(selector: (store: ReturnType<typeof useModuleStore>) => T): T => {
  const context = useContext(CourseProgressionContext);
  if (!context) {
    throw new Error(`useModuleProgressionStore must be used within CourseProgressionProvider`);
  }
  return useZustandStore(context.moduleStore, selector);
};

export const useCourseProgressionStore = <T,>(selector: (store: ReturnType<typeof useCourseStore>) => T): T => {
  const context = useContext(CourseProgressionContext);
  if (!context) {
    throw new Error(`useCourseProgressionStore must be used within CourseProgressionProvider`);
  }
  return useZustandStore(context.courseStore, selector);
};



 */
