'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore as useZustandStore } from 'zustand';

import {
  createLessonStore,
  LessonProgressStore,
  createPointsStore,
  PointsStore,
  createModuleStore,
  ModuleProgressStore,
  createCourseStore,
  CourseProgressStore,
} from '@rocket-house-productions/store';

type CombinedStores = {
  lessonStore: ReturnType<typeof createLessonStore>;
  pointsStore: ReturnType<typeof createPointsStore>;
  moduleStore: ReturnType<typeof createModuleStore>;
  courseStore: ReturnType<typeof createCourseStore>;
};

const CourseProgressionContext = createContext<CombinedStores | undefined>(undefined);

export const CourseProgressionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const lessonStoreRef = useRef<CombinedStores['lessonStore']>();
  const pointsStoreRef = useRef<CombinedStores['pointsStore']>();
  const moduleStoreRef = useRef<CombinedStores['moduleStore']>();
  const courseStoreRef = useRef<CombinedStores['courseStore']>();

  if (!lessonStoreRef.current) {
    lessonStoreRef.current = createLessonStore();
  }

  if (!pointsStoreRef.current) {
    pointsStoreRef.current = createPointsStore();
  }

  if (!moduleStoreRef.current) {
    moduleStoreRef.current = createModuleStore(lessonStoreRef.current);
  }

  if (!courseStoreRef.current) {
    courseStoreRef.current = createCourseStore(moduleStoreRef.current);
  }

  return (
    <CourseProgressionContext.Provider
      value={{
        lessonStore: lessonStoreRef.current,
        pointsStore: pointsStoreRef.current,
        moduleStore: moduleStoreRef.current,
        courseStore: courseStoreRef.current,
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

export const useModuleProgressStore = <T,>(selector: (store: ModuleProgressStore) => T): T => {
  const context = useContext(CourseProgressionContext);
  if (!context) {
    throw new Error(`useModuleProgressStore must be used within CourseProgressionProvider`);
  }
  return useZustandStore(context.moduleStore, selector);
};

export const useCourseProgressionStore = <T,>(selector: (store: CourseProgressStore) => T): T => {
  const context = useContext(CourseProgressionContext);
  if (!context) {
    throw new Error(`useCourseProgressionStore must be used within CourseProgressionProvider`);
  }
  return useZustandStore(context.courseStore, selector);
};