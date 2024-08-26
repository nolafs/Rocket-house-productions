import { createStore, StoreApi } from 'zustand';
import { ModuleProgressStore } from './use-module-progress-store';
import { persist } from 'zustand/middleware';

type Course = {
  progress: number;
  modules: string[]; // Array of module IDs
};

type CourseState = {
  courses: { [courseId: string]: Course };
};

interface CourseAction {
  setCourseProgress: (courseId: string, progress: number) => void;
  calculateCourseProgress: (courseId: string) => void;
  getCourseProgress: (courseId: string) => number;
}

export type CourseProgressStore = CourseState & CourseAction;

export const defaultInitState: CourseState = {
  courses: {},
};

export const createCourseStore = (
  userId: string,
  moduleState: StoreApi<ModuleProgressStore>,
  initState = defaultInitState,
  // Pass userId or another unique identifier for persistence
) =>
  createStore<CourseProgressStore>()(
    persist(
      (set, get) => ({
        ...initState,

        setCourseProgress: (courseId, progress) =>
          set(state => ({
            courses: {
              ...state.courses,
              [courseId]: {
                ...state.courses[courseId],
                progress,
              },
            },
          })),

        getCourseProgress: courseId => get().courses[courseId]?.progress || 0,
        calculateCourseProgress: courseId => {
          const course = get().courses[courseId];
          const moduleStore = moduleState.getState();

          console.log(['COURSE PROGRESSION'], course, moduleStore);

          const modules = course?.modules || [];
          const totalModules = modules.length;
          const completedModules = modules.filter(moduleId => moduleStore.modules[moduleId]?.progress === 100).length;

          const progress = (completedModules / totalModules) * 100;

          set(state => ({
            courses: {
              ...state.courses,
              [courseId]: {
                ...state.courses[courseId],
                progress,
              },
            },
          }));
        },
      }),
      {
        name: `course-progress-store-${userId}`, // Unique storage key per user or context
        partialize: state => ({ courses: state.courses }), // Persist only the courses part of the state
        // You can also specify a storage engine here, like sessionStorage or any custom storage
      },
    ),
  );
