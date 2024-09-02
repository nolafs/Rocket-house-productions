import { createStore } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { Child, ChildProgress } from '@prisma/client';

interface QuestionProgress {
  [questionId: string]: boolean;
}

interface Lesson {
  progress: number;
  completed: boolean;
  duration: number;
  progressSeconds: number;
  replayCount: number;
  questions: QuestionProgress;
}

type LessonState = {
  lessons: { [lessonId: string]: Lesson };
};

type LessonAction = {
  setLessonComplete: (lessonId: string) => void;
  setLessonProgress: (lessonId: string, progress: number, progressSeconds: number, duration: number) => void;
  setQuestionProgress: (lessonId: string, questionId: string, completed: boolean) => void;
  setReplayCount: (lessonId: string) => void;
  updateCurrentState: (lessonId: string) => void;
  getLessonProgress: (lessonId: string) => number;
  getLessonDuration: (lessonId: string) => { duration: number; progressSeconds: number };
  getLessonCompleted: (lessonId: string) => boolean;
  getReplayCount: (lessonId: string) => number;
  syncLessonProgressWithDB: (childId: string, courseId: string) => void;
};

export type LessonProgressStore = LessonState & LessonAction;

export const defaultInitState: LessonState = {
  lessons: {},
};

export const createLessonStore = (
  userId: string,
  courseId: string,
  initState: LessonState = defaultInitState,
  // Pass userId or another unique identifier for persistence
) => {
  return createStore<LessonProgressStore>()(
    persist(
      (set, get) => ({
        ...initState,

        setLessonComplete: lessonId => {
          const updatedLessons = set(state => ({
            lessons: {
              ...state.lessons,
              [lessonId]: {
                ...state.lessons[lessonId],
                progress: 100,
                completed: true,
              },
            },
          }));

          updateDBLessonProgress(userId, lessonId, courseId, 100, true, get().getReplayCount(lessonId));

          return updatedLessons;
        },
        setReplayCount: lessonId => {
          const isCompleted = get().getLessonCompleted(lessonId);
          let replayCount = get().getReplayCount(lessonId);

          if (isCompleted) {
            replayCount = replayCount + 1;
          }

          set(state => ({
            lessons: {
              ...state.lessons,
              [lessonId]: {
                ...state.lessons[lessonId],
                replayCount,
              },
            },
          }));
        },
        updateCurrentState: lessonId => {
          const progress = get().lessons[lessonId]?.progress || 0;
          const completed = get().lessons[lessonId]?.completed || false;
          const replayCount = get().lessons[lessonId]?.replayCount || 0;

          updateDBLessonProgress(userId, lessonId, courseId, progress, completed, replayCount);
        },
        setLessonProgress: (lessonId, progress, progressSeconds, duration) =>
          set(state => ({
            lessons: {
              ...state.lessons,
              [lessonId]: {
                ...state.lessons[lessonId],
                progress,
                progressSeconds,
                duration,
              },
            },
          })),

        setQuestionProgress: (lessonId, questionId, completed) =>
          set(state => ({
            lessons: {
              ...state.lessons,
              [lessonId]: {
                ...state.lessons[lessonId],
                questions: {
                  ...state.lessons[lessonId].questions,
                  [questionId]: completed,
                },
              },
            },
          })),
        getReplayCount: lessonId => get().lessons[lessonId]?.replayCount || 0,
        getLessonProgress: lessonId => get().lessons[lessonId]?.progress || 0,
        getLessonCompleted: lessonId => get().lessons[lessonId]?.completed || false,
        getLessonDuration: lessonId => {
          const lesson = get().lessons[lessonId];
          return { duration: lesson?.duration || 0, progressSeconds: lesson?.progressSeconds || 0 };
        },
        syncLessonProgressWithDB: async (childId, courseId) => {
          try {
            const lessons = get().lessons;
            const lessonsProgress: ChildProgress[] = await getLessonsProgress(childId, courseId);

            const updatedLessons = { ...lessons };

            lessonsProgress.forEach(lessonProgress => {
              const lessonId = lessonProgress.lessonId;
              const lesson = lessons[lessonId];

              if (lesson) {
                updatedLessons[lessonId] = {
                  ...lesson,
                  progress: lessonProgress.currentProgress,
                  completed: lessonProgress.isCompleted,
                  replayCount: lessonProgress.replayCount,
                };
              } else {
                updatedLessons[lessonId] = {
                  progress: lessonProgress.currentProgress || 0,
                  completed: lessonProgress.isCompleted || false,
                  replayCount: lessonProgress.replayCount || 0,
                  progressSeconds: 0,
                  duration: 0,
                  questions: {},
                };
              }
            });
            set({ lessons: updatedLessons });
          } catch (error) {
            console.error('Error syncing lesson progress:', error);
          }
        },
      }),
      {
        name: `lesson-progress-store-${userId}`, // Unique storage key per user or context
        partialize: state => ({ lessons: state.lessons }), // Persist only the lessons part of the state
        onRehydrateStorage: () => async state => {
          await state?.syncLessonProgressWithDB?.(userId, courseId); // Sync after rehydration
        },
      },
    ),
  );
};

const updateDBLessonProgress = async (
  childId: string,
  lessonId: string,
  courseId: string,
  currentProgress: number,
  isCompleted: boolean,
  replayCount: number,
) => {
  try {
    const response = await axios.post('/api/courses/progress', {
      childId,
      lessonId,
      courseId,
      isCompleted,
      currentProgress,
      replayCount,
    });
  } catch (error) {
    console.error('Error updating lesson progress:', error);
  }
};

const getLessonsProgress = async (childId: string, courseId: string) => {
  try {
    const response = await axios.get(`/api/courses/progress?childId=${childId}&courseId=${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting lessons progress:', error);
    return {};
  }
};
