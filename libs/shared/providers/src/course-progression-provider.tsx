'use client';

import { type ReactNode, createContext, useRef, useContext, FC, useState, useEffect } from 'react';
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
import { Course } from '@rocket-house-productions/prisma-client';

type CombinedStores = {
  lessonStore: ReturnType<typeof createLessonStore> | null;
  pointsStore: ReturnType<typeof createPointsStore> | null;
  moduleStore: ReturnType<typeof createModuleStore> | null;
  courseStore: ReturnType<typeof createCourseStore> | null;
};

interface CourseProgressionProviderProps {
  children: ReactNode;
  userId: string; // Add userId as a prop
  course: Course; // Add courseId as a prop
}

const CourseProgressionContext = createContext<CombinedStores | undefined>(undefined);

export const CourseProgressionProvider: FC<CourseProgressionProviderProps> = ({ userId, course, children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [stores, setStores] = useState<CombinedStores>({
    lessonStore: null,
    pointsStore: null,
    moduleStore: null,
    courseStore: null,
  });

  const lessonStoreRef = useRef<CombinedStores['lessonStore'] | null>(null);
  const pointsStoreRef = useRef<CombinedStores['pointsStore'] | null>(null);
  const moduleStoreRef = useRef<CombinedStores['moduleStore'] | null>(null);
  const courseStoreRef = useRef<CombinedStores['courseStore'] | null>(null);

  useEffect(() => {
    if (!lessonStoreRef.current) {
      lessonStoreRef.current = createLessonStore(userId, course.id);
    }
    if (!pointsStoreRef.current) {
      pointsStoreRef.current = createPointsStore(userId, course.id);
    }
    if (!moduleStoreRef.current) {
      moduleStoreRef.current = createModuleStore(userId, course.id, lessonStoreRef.current);
    }
    if (!courseStoreRef.current) {
      courseStoreRef.current = createCourseStore(userId, course, moduleStoreRef.current, lessonStoreRef.current);
    }

    setStores({
      lessonStore: lessonStoreRef.current,
      pointsStore: pointsStoreRef.current,
      moduleStore: moduleStoreRef.current,
      courseStore: courseStoreRef.current,
    });
    setIsInitialized(true);
  }, [userId, course]);

  if (!isInitialized) {
    return null;
  }

  return <CourseProgressionContext.Provider value={stores}>{children}</CourseProgressionContext.Provider>;
};

export const useLessonProgressionStore = <T,>(selector: (store: LessonProgressStore) => T): T => {
  const context = useContext(CourseProgressionContext);
  if (!context || !context.lessonStore) {
    throw new Error(`useLessonProgressionStore must be used within CourseProgressionProvider`);
  }

  return useZustandStore(context.lessonStore, selector);
};

export const usePointsStore = <T,>(selector: (store: PointsStore) => T): T => {
  const context = useContext(CourseProgressionContext);
  if (!context || !context.pointsStore) {
    throw new Error(`usePointsProgressionStore must be used within CourseProgressionProvider`);
  }
  return useZustandStore(context.pointsStore, selector);
};

export const useModuleProgressStore = <T,>(selector: (store: ModuleProgressStore) => T): T => {
  const context = useContext(CourseProgressionContext);
  if (!context || !context.moduleStore) {
    throw new Error(`useModuleProgressStore must be used within CourseProgressionProvider`);
  }
  return useZustandStore(context.moduleStore, selector);
};

export const useCourseProgressionStore = <T,>(selector: (store: CourseProgressStore) => T): T => {
  const context = useContext(CourseProgressionContext);
  if (!context || !context.courseStore) {
    throw new Error(`useCourseProgressionStore must be used within CourseProgressionProvider`);
  }
  return useZustandStore(context.courseStore, selector);
};
