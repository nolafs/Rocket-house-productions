import { createStore, StoreApi } from 'zustand';
import { LessonProgressStore } from './use-lesson-progress-store';

type ModuleProgression = {
  progress: number;
  color: string;
  lessons: string[]; // Array of lesson IDs
};

type Module = {
  id: string;
  title: string;
  color: string;
  description: string;
};

type ModuleState = {
  modules: { [moduleId: string]: ModuleProgression };
  currentModule?: Module | null;
};

type ModuleAction = {
  setCurrentModule: (module: Module | null) => void;
  setModuleProgress: (moduleId: string, progress: number) => void;
  calculateModuleProgress: (moduleId: string) => void;
  getModuleProgress: (moduleId: string) => number;
  getCurrentModule: () => Module | null;
};

export type ModuleProgressStore = ModuleState & ModuleAction;

export const defaultInitState: ModuleState = {
  modules: {},
  currentModule: null,
};

export const createModuleStore = (
  lessonState: StoreApi<LessonProgressStore>,
  initState: ModuleState = defaultInitState,
) =>
  createStore<ModuleProgressStore>((set, get) => ({
    ...initState,

    setCurrentModule: module => set({ currentModule: module }),

    setModuleProgress: (moduleId, progress) =>
      set(state => ({
        modules: {
          ...state.modules,
          [moduleId]: {
            ...state.modules[moduleId],
            progress,
          },
        },
      })),

    calculateModuleProgress: moduleId => {
      const module = get().modules[moduleId];
      const lessonStore = lessonState.getState();

      console.log('MODULE STORE: ', lessonStore);

      const lessons = module?.lessons || [];
      const totalLessons = lessons.length;
      const completedLessons = lessons.filter(lessonId => lessonStore.lessons[lessonId]?.progress === 100).length;

      const progress = (completedLessons / totalLessons) * 100;

      set(state => ({
        modules: {
          ...state.modules,
          [moduleId]: {
            ...state.modules[moduleId],
            progress,
          },
        },
      }));
    },
    getModuleProgress: moduleId => get().modules[moduleId]?.progress || 0,
    getCurrentModule: () => get().currentModule || null,
  }));
