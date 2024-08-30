import { createStore, StoreApi } from 'zustand';
import { LessonProgressStore } from './use-lesson-progress-store';
import { persist } from 'zustand/middleware';
import { AwardType, Lesson, Module as ModuleDB, ModuleAwardType } from '@prisma/client';

type ModuleSection = ModuleDB & {
  lessons: Lesson[]; // Array of lesson IDs
  availableAwards: AvailableAward[];
};

type AvailableAward = ModuleAwardType & {
  id: string;
  awardType: AwardType;
  moduleId: string;
  awarded: boolean;
  awardNotified: boolean;
};

export type ModuleProgression = {
  title: string;
  description: string;
  progress: number;
  color: string;
  lessons: Lesson[]; // Array of lesson IDs
  availableAwards: AvailableAward[];
};

type ModuleState = {
  modules: { [moduleId: string]: ModuleProgression };
  currentModule?: ModuleProgression | null;
};

type ModuleAction = {
  addModule: (module: ModuleSection) => void;
  setCurrentModule: (moduleId: string | null) => void;
  setModuleProgress: (moduleId: string, progress: number) => void;
  setAwardNotification: (moduleId: string, awardId: string) => void;
  calculateModuleProgress: (moduleId: string) => void;
  getModuleProgress: (moduleId: string) => number;
  getModulesAwardNotification: () => AvailableAward[];
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
            availableAwards: module.availableAwards.map(award => ({
              ...award,
              awarded: false,
              awardNotified: false,
            })),
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

          if (progress === 100) {
            const updatedAwards = module.availableAwards.map(award => {
              if (!award.awarded) {
                // Award the player for this specific award
                console.log(`Player awarded: ${award.awardType} for completing module: ${module.title}`);
                // Mark the award as granted
                return {
                  ...award,
                  awarded: true,
                  awardNotified: false,
                };
              }
              return award;
            });

            set(state => ({
              modules: {
                ...state.modules,
                [moduleId]: {
                  ...state.modules[moduleId],
                  progress,
                  availableAwards: updatedAwards,
                },
              },
            }));
          } else {
            set(state => ({
              modules: {
                ...state.modules,
                [moduleId]: {
                  ...state.modules[moduleId],
                  progress,
                },
              },
            }));
          }
        },
        getModulesAwardNotification: () => {
          const modules = get().modules;
          const awards = Object.values(modules).reduce((acc, module) => {
            const moduleAwards = module.availableAwards.filter(award => !award.awardNotified && award.awarded);
            return [...acc, ...moduleAwards];
          }, [] as AvailableAward[]);
          return awards;
        },
        setAwardNotification: (moduleId, awardId) => {
          set(state => ({
            modules: {
              ...state.modules,
              [moduleId]: {
                ...state.modules[moduleId],
                availableAwards: state.modules[moduleId].availableAwards.map(award => {
                  if (award.id === awardId) {
                    return {
                      ...award,
                      awardNotified: true,
                    };
                  }
                  return award;
                }),
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
