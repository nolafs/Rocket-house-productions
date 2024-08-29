import { createStore, StoreApi } from 'zustand';
import { LessonProgressStore } from './use-lesson-progress-store';
import { persist } from 'zustand/middleware';
import { Lesson, Module as ModuleDB, ModuleAwardType } from '@prisma/client';

type ModuleSection = ModuleDB & {
  lessons: Lesson[]; // Array of lesson IDs
  availableAwards: ModuleAwardType[];
};

export type ModuleProgression = {
  title: string;
  description: string;
  progress: number;
  color: string;
  lessons: Lesson[]; // Array of lesson IDs
  availableAwards: ModuleAwardType[];
};

type ModuleState = {
  modules: { [moduleId: string]: ModuleProgression };
  currentModule?: ModuleProgression | null;
};

type ModuleAction = {
  addModule: (module: ModuleSection) => void;
  setCurrentModule: (moduleId: string | null) => void;
  setModuleProgress: (moduleId: string, progress: number) => void;
  calculateModuleProgress: (moduleId: string) => void;
  getModuleProgress: (moduleId: string) => number;
  getCurrentModule: () => ModuleProgression | null;
  getAllModules: () => { [moduleId: string]: ModuleProgression };
};

export type ModuleProgressStore = ModuleState & ModuleAction;

export const defaultInitState: ModuleState = {
  modules: {},
  currentModule: null,
};

export const createModuleStore = (
  userId: string,
  lessonState: StoreApi<LessonProgressStore>,
  initState: ModuleState = defaultInitState,
  // Pass userId or other unique identifier for the key
) =>
  createStore<ModuleProgressStore>()(
    persist(
      (set, get) => ({
        ...initState,
        addModule: module => {
          const moduleId = module.id;
          let progress = 0;
          const existingModule = get().modules[moduleId];
          // Check if the module already exists
          if (existingModule) {
            console.warn(`Module with ID ${moduleId} already exists.`);
            // merge the existing module with the new one
            progress = existingModule.progress;
          }

          // Cast the module to the ModuleProgression type
          const moduleProgression: ModuleProgression = {
            title: module.title,
            description: module.description || '',
            progress: progress,
            color: module.color || 'transparent',
            lessons: module.lessons,
            availableAwards: module.availableAwards,
          };

          set(state => ({
            modules: {
              ...state.modules,
              [module.id]: {
                ...moduleProgression,
              },
            },
          }));
        },
        // Set the current module by its ID, directly from the existing modules list
        setCurrentModule: moduleId => {
          if (!moduleId) {
            set({ currentModule: null });
            return;
          }
          const module = get().modules[moduleId];
          if (module) {
            set({ currentModule: module });
          } else {
            console.warn(`Module with ID ${moduleId} does not exist.`);
          }
        },

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

          const lessons = module?.lessons || [];
          const totalLessons = lessons.length;
          const completedLessons = lessons.filter(lesson => lessonStore.lessons[lesson.id]?.completed);

          const progress = (completedLessons.length / totalLessons) * 100;

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
        getAllModules: () => get().modules,
      }),
      {
        name: `module-progress-store-${userId}`, // Unique storage key per user or context
        partialize: state => ({ modules: state.modules }), // Persist only the modules part of the state
        // You can also specify a storage engine here, like sessionStorage or any custom storage
      },
    ),
  );
