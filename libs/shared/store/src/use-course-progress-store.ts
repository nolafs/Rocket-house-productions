import { createStore, StoreApi } from 'zustand';
import { ModuleProgressStore } from './use-module-progress-store';

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
}

export type CourseProgressStore = CourseState & CourseAction;

export const defaultInitState: CourseState = {
  courses: {},
};

export const createCourseStore = (moduleState: StoreApi<ModuleProgressStore>, initState = defaultInitState) =>
  createStore<CourseProgressStore>((set, get) => ({
    courses: {},

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

    calculateCourseProgress: courseId => {
      const course = get().courses[courseId];
      const moduleStore = moduleState.getState();

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
  }));
