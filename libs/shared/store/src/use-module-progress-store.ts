import { createStore, StoreApi } from 'zustand';
import { LessonProgressStore } from './use-lesson-progress-store';
import { persist } from 'zustand/middleware';
import { AwardType, Lesson, Module as ModuleDB, ModuleAttachmemtType, ModuleAwardType } from '@prisma/client';
import axios from 'axios';

type ModuleSection = ModuleDB & {
  lessons: Lesson[]; // Array of lesson IDs
  availableAwards: AvailableAward[];
  attachments?: ModuleAttachment[];
};

type ModuleAttachment = {
  id: string;
  name: string;
  url: string;
  attachmentType: ModuleAttachmemtType;
};

export type AvailableAward = ModuleAwardType & {
  id: string;
  awardType: AwardType;
  moduleId: string;
  awarded: boolean;
  awardNotified: boolean;
  attachments?: ModuleAttachment[];
};

export type ModuleProgression = {
  id?: string;
  title: string;
  description: string;
  progress: number;
  color: string;
  lessons: Lesson[]; // Array of lesson IDs
  availableAwards: AvailableAward[];
  attachments?: ModuleAttachment[];
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
  getAwards: () => AvailableAward[];
  getAttachment: (moduleId: string) => ModuleAttachment[];
  getCurrentModule: () => ModuleProgression | null;
  getAllModules: () => { [moduleId: string]: ModuleProgression };
  syncModuleProgressWithDB: (childId: string, courseId: string) => void;
};

export type ModuleProgressStore = ModuleState & ModuleAction;

export const defaultInitState: ModuleState = {
  modules: {},
  currentModule: null,
};

export const createModuleStore = (
  userId: string,
  courseId: string,
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
          let updatedAwards = module.availableAwards;
          const existingModule = get().modules[moduleId];
          // Check if the module already exists
          if (existingModule) {
            console.warn(`Module with ID ${moduleId} already exists.`);
            // merge the existing module with the new one
            progress = existingModule.progress;
            // merge awards if they are not already awarded
            updatedAwards = module.availableAwards.map(award => {
              const existingAward = existingModule.availableAwards.find(a => a.id === award.id);
              if (existingAward && existingAward.awarded) {
                return existingAward;
              }
              return award;
            });
          } else {
            // set awarded and awardNotified to false for all awards
            updatedAwards = module.availableAwards.map(award => ({
              ...award,
              awarded: false,
              awardNotified: false,
            }));
          }

          // Cast the module to the ModuleProgression type
          const moduleProgression: ModuleProgression = {
            title: module.title,
            description: module.description || '',
            progress: progress,
            color: module.color || 'transparent',
            lessons: module.lessons,
            availableAwards: updatedAwards,
            attachments: module.attachments || [],
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
              if (!award.awarded && !award.awardNotified) {
                // Award the player for this specific award
                console.log(`Player awarded: ${award.awardType} for completing module: ${module.title}`);
                // Mark the award as granted
                return {
                  ...award,
                  awarded: true,
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
            const moduleAwards = module.availableAwards?.filter(award => !award.awardNotified && award.awarded) || [];
            return [...acc, ...moduleAwards];
          }, [] as AvailableAward[]);
          return awards;
        },
        setAwardNotification: (moduleId, awardId) => {
          const module = get().modules[moduleId];
          if (!module) {
            console.warn(`Module with ID ${moduleId} does not exist.`);
            return;
          }

          const updateAward = module.availableAwards.find(award => award.id === awardId);
          if (!updateAward) {
            console.warn(`Award with ID ${awardId} does not exist in module ${moduleId}.`);
            return;
          }

          //set the award as notified
          updateAward.awardNotified = true;

          // Update the award in the database

          updateDbChildAwards(userId, updateAward.awardType.id, moduleId, null);

          // Update the award in the store
          set(state => ({
            modules: {
              ...state.modules,
              [moduleId]: {
                ...state.modules[moduleId],
                availableAwards: state.modules[moduleId].availableAwards.map(award => {
                  if (award.id === awardId) {
                    return updateAward;
                  }
                  return award;
                }),
              },
            },
          }));
        },
        getAwards: () => {
          const modules = get().modules;

          const awards = Object.values(modules).reduce((acc, module) => {
            const moduleAwards = module.availableAwards?.filter(award => award.awarded && award.awardNotified) || [];
            return [...acc, ...moduleAwards];
          }, [] as AvailableAward[]);
          return awards;
        },
        getAttachment: (moduleId: string) => {
          const module = get().modules[moduleId];
          return module?.attachments || [];
        },
        getModuleProgress: moduleId => get().modules[moduleId]?.progress || 0,
        getCurrentModule: () => get().currentModule || null,
        getAllModules: () => get().modules,
        syncModuleProgressWithDB: async (childId, courseId) => {
          try {
            const modules = get().modules;
            const moduleProgress = await getModuleProgress(childId, courseId);
            const moduleAwards = await getModuleAwards(childId, courseId);

            console.log('SYNC WITH DATABASE');

            const updatedModules = { ...modules };

            const moduleDb = moduleProgress.map((progress: any) => {
              return {
                lesson: {
                  isCompleted: progress.isCompleted,
                  currentProgress: progress.currentProgress,
                },
                moduleId: progress.lesson.module.id, // Add moduleId explicitly
                ...progress.lesson.module,
              };
            });

            // Reduce to accumulate and calculate progress per module
            const updateModuleList = moduleDb.reduce((acc: any[], current: any) => {
              const moduleId = current.moduleId;

              // Find the module in the accumulator
              let module = acc.find((mod: any) => mod.id === moduleId);
              const awards = moduleAwards.filter((award: any) => award.moduleId === moduleId) || [];
              let awardsList: AvailableAward[] = [];

              if (awards.length) {
                awardsList = awards.map((award: any) => {
                  return {
                    id: award.id,
                    awardType: award.awardType,
                    moduleId: award.moduleId,
                    awarded: true,
                    awardNotified: true,
                  };
                });
              }

              if (!module) {
                // If the module doesn't exist in the accumulator, add it
                module = {
                  id: moduleId,
                  title: current.title,
                  description: current.description,
                  color: current.color,
                  totalProgress: 0, // Initialize total progress
                  lessonCount: 0, // Initialize lesson count
                  lessons: [], // Initialize lessons array if needed
                  availableAwards: awardsList,
                  attachments: current.attachments || [],
                };
                acc.push(module);
              }

              // Accumulate progress and count lessons
              module.totalProgress += current.lesson.currentProgress;
              module.lessonCount += 1;

              // Optional: Add the lesson to the lessons array
              module.lessons.push(current.lesson);

              return acc;
            }, []);

            updateModuleList.forEach((progression: any) => {
              const module = modules[progression.id];

              if (module) {
                updatedModules[progression.id] = {
                  ...module,
                  title: progression.title,
                  description: progression.description,
                  color: progression.color,
                  progress: progression.totalProgress / progression.lessonCount,
                  lessons: progression.lessons,
                  availableAwards: module.availableAwards,
                  attachments: module.attachments || [],
                };
              } else {
                updatedModules[progression.id] = {
                  title: progression.title,
                  description: progression.description,
                  color: progression.color,
                  progress: progression.totalProgress / progression.lessonCount,
                  lessons: progression.lessons,
                  availableAwards: progression.availableAwards || [],
                  attachments: progression.attachments || [],
                };
              }
            });

            set({ modules: updatedModules });
          } catch (error) {
            console.error('Error syncing module progress:', error);
          }
        },
      }),
      {
        name: `module-progress-store-${userId}`, // Unique storage key per user or context
        partialize: state => ({ modules: state.modules }), // Persist only the modules part of the state
        onRehydrateStorage: () => async state => {
          await state?.syncModuleProgressWithDB?.(userId, courseId); // Sync after rehydration
        },
      },
    ),
  );

const updateDbChildAwards = async (
  userId: string,
  awardTypeId: string,
  moduleId: string | null,
  lesson: string | null,
) => {
  try {
    const response = await axios.post(`/api/courses/awards`, {
      childId: userId,
      awardTypeId: awardTypeId,
      moduleId: moduleId || null,
    });
  } catch (error) {
    console.error('Error updating child awards:', error);
  }
};

const getModuleProgress = async (childId: string, courseId: string) => {
  try {
    const response = await axios.get(`/api/courses/progress?childId=${childId}&courseId=${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting lessons progress:', error);
    return {};
  }
};

const getModuleAwards = async (childId: string, courseId: string) => {
  try {
    const response = await axios.get(`/api/courses/awards?childId=${childId}&courseId=${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting lessons progress:', error);
    return {};
  }
};
