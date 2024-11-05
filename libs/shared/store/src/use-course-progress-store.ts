import { createStore, StoreApi } from 'zustand';
import { ModuleProgressStore } from './use-module-progress-store';
import { persist } from 'zustand/middleware';
import { Module as ModuleDB } from '@prisma/client';
import { LessonProgressStore } from './use-lesson-progress-store';

type Course = {
  id: string;
  title: string;
  progress: number;
  completed: number;
  total: number;
  modules: ModuleDB[]; // Array of module IDs
};

type CourseState = {
  courses: { [courseId: string]: Course };
  currentCourse: string | null;
  currentCourseProgress: number;
};

interface CourseAction {
  addCourse: (course: Course) => void;
  setCourseProgress: (courseId: string, progress: number) => void;
  calculateCourseProgress: (courseId: string) => void;
  getCourseProgress: (courseId: string) => number | null;
  getCourseLessonProgress: (courseId: string) => number | null;
  getCurrentCourse: () => Course | null;
}

export type CourseProgressStore = CourseState & CourseAction;

export const defaultInitState: CourseState = {
  courses: {},
  currentCourse: null,
  currentCourseProgress: 0,
};

export const createCourseStore = (
  userId: string,
  course: any,
  moduleState: StoreApi<ModuleProgressStore>,
  lessonState: StoreApi<LessonProgressStore>,
  initState = defaultInitState,
  // Pass userId or another unique identifier for persistence
) =>
  createStore<CourseProgressStore>()(
    persist(
      (set, get) => ({
        ...initState,
        addCourse: course => {
          console.log('[COURSE STORE] - ADD');

          const courseId = course.id;
          let progress = 0;
          let completed = 0;
          let total = 0;

          const existingCourse = get().courses[courseId];

          if (existingCourse) {
            console.warn(`Course with ID ${courseId} already exists.`);
            progress = existingCourse.progress;
            completed = existingCourse.completed;
            total = existingCourse.total;
          }

          set(state => ({
            currentCourse: courseId,
            currentCourseProgress: progress,
            courses: {
              ...state.courses,
              [courseId]: {
                title: course.title,
                id: course.id,
                modules: course.modules,
                progress,
                completed,
                total,
              },
            },
          }));
        },

        setCourseProgress: (courseId, progress) =>
          set(state => ({
            currentCourse: courseId,
            currentCourseProgress: progress,
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
        getCurrentCourse: () => {
          const currentCourse = get().currentCourse;
          return currentCourse ? get().courses[currentCourse] : null;
        },

        getCourseLessonProgress: courseId => {
          const progress = get().courses[courseId]?.total;

          if (progress !== null) {
            return progress;
          }
          return null;
        },

        calculateCourseProgress: courseId => {
          console.log('[COURSE STORE] - CALC');

          const course = get().courses[courseId];
          const moduleStore = moduleState.getState();
          const lessonStore = lessonState.getState();

          const modules = course?.modules || [];
          const totalModules = modules.length;

          const completedModules = modules.filter(module => moduleStore.modules[module.id]?.progress === 100);
          const progressModule = modules.reduce((acc, module) => {
            const moduleProgress = moduleStore.modules[module.id]?.progress || 0;
            return acc + moduleProgress;
          }, 0);

          const completed = (completedModules.length / totalModules) * 100;
          const progress = totalModules > 0 ? progressModule / totalModules : 0;

          let totalLessons = 0;
          let totalCompletedLessons = 0;

          modules.forEach((module: any) => {
            const lessons = module.lessons || [];
            return lessons.map((item: any) => {
              totalLessons += 1;
              totalCompletedLessons += lessonStore?.lessons[item.id]?.completed
                ? 100
                : lessonStore?.lessons[item.id]?.progress || 0;
            });
          });

          const total = (totalCompletedLessons / (100 * totalLessons)) * 100;

          set(state => ({
            currentCourse: courseId,
            currentCourseProgress: progress,
            courses: {
              ...state.courses,
              [courseId]: {
                ...state.courses[courseId],
                progress,
                completed,
                total,
              },
            },
          }));
        },
      }),
      {
        name: `course-progress-store-${userId}`,
        onRehydrateStorage: () => state => {
          if (state) {
            console.log('[COURSE STORE] - onRehydrateStorage');
            // Run addCourse on rehydration
            state.addCourse(course);
            if (course) {
              state.calculateCourseProgress(course.id);
            }
          }
        }, // Unique storage key per user or context
        partialize: state => ({ courses: state.courses }), // Persist only the courses part of the state
        // You can also specify a storage engine here, like sessionStorage or any custom storage
      },
    ),
  );
