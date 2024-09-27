import { createStore, StoreApi } from 'zustand';
import { ModuleProgressStore } from './use-module-progress-store';
import { persist } from 'zustand/middleware';
import { Module as ModuleDB } from '@prisma/client';

type Course = {
  id: string;
  title: string;
  progress: number;
  completed: number;
  modules: ModuleDB[]; // Array of module IDs
};

type CourseState = {
  courses: { [courseId: string]: Course };
};

interface CourseAction {
  addCourse: (course: Course) => void;
  setCourseProgress: (courseId: string, progress: number) => void;
  calculateCourseProgress: (courseId: string) => void;
  getCourseProgress: (courseId: string) => number | null;
}

export type CourseProgressStore = CourseState & CourseAction;

export const defaultInitState: CourseState = {
  courses: {},
};

export const createCourseStore = (
  userId: string,
  course: any,
  moduleState: StoreApi<ModuleProgressStore>,
  initState = defaultInitState,
  // Pass userId or another unique identifier for persistence
) =>
  createStore<CourseProgressStore>()(
    persist(
      (set, get) => ({
        ...initState,
        addCourse: course => {
          const courseId = course.id;
          let progress = 0;
          let completed = 0;
          const existingCourse = get().courses[courseId];
          if (existingCourse) {
            console.warn(`Course with ID ${courseId} already exists.`);
            progress = existingCourse.progress;
            completed = existingCourse.completed;
          }

          set(state => ({
            courses: {
              ...state.courses,
              [courseId]: {
                title: course.title,
                id: course.id,
                modules: course.modules,
                progress,
                completed,
              },
            },
          }));
        },

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

        getCourseProgress: courseId => {
          const progress = get().courses[courseId]?.progress;

          if (progress !== null) {
            return progress;
          }
          return null;
        },

        calculateCourseProgress: courseId => {
          const course = get().courses[courseId];
          const moduleStore = moduleState.getState();

          const modules = course?.modules || [];
          const totalModules = modules.length;

          const completedModules = modules.filter(module => moduleStore.modules[module.id]?.progress === 100);
          const progressModule = modules.reduce((acc, module) => {
            const moduleProgress = moduleStore.modules[module.id]?.progress || 0;
            return acc + moduleProgress;
          }, 0);

          const completed = (completedModules.length / totalModules) * 100;
          const progress = totalModules > 0 ? progressModule / totalModules : 0;

          console.log(['COURSE PROGRESSION - progress'], progress);
          console.log(['COURSE PROGRESSION - moduleStore'], completed);

          set(state => ({
            courses: {
              ...state.courses,
              [courseId]: {
                ...state.courses[courseId],
                progress,
                completed,
              },
            },
          }));
        },
      }),
      {
        name: `course-progress-store-${userId}`,
        onRehydrateStorage: () => state => {
          if (state) {
            // Run addCourse on rehydration
            state.addCourse(course);
          }
        }, // Unique storage key per user or context
        partialize: state => ({ courses: state.courses }), // Persist only the courses part of the state
        // You can also specify a storage engine here, like sessionStorage or any custom storage
      },
    ),
  );
