import { createStore } from 'zustand';
import { persist } from 'zustand/middleware';

interface QuestionProgress {
  [questionId: string]: boolean;
}

interface Lesson {
  progress: number;
  completed: boolean;
  questions: QuestionProgress;
}

type LessonState = {
  lessons: { [lessonId: string]: Lesson };
};

type LessonAction = {
  setLessonComplete: (lessonId: string) => void;
  setLessonProgress: (lessonId: string, progress: number) => void;
  setQuestionProgress: (lessonId: string, questionId: string, completed: boolean) => void;
  getLessonProgress: (lessonId: string) => number;
  getLessonCompleted: (lessonId: string) => boolean;
};

export type LessonProgressStore = LessonState & LessonAction;

export const defaultInitState: LessonState = {
  lessons: {},
};

export const createLessonStore = (
  userId: string,
  initState: LessonState = defaultInitState,
  // Pass userId or another unique identifier for persistence
) => {
  return createStore<LessonProgressStore>()(
    persist(
      (set, get) => ({
        ...initState,

        setLessonComplete: lessonId =>
          set(state => ({
            lessons: {
              ...state.lessons,
              [lessonId]: {
                ...state.lessons[lessonId],
                progress: 100,
                completed: true,
              },
            },
          })),

        setLessonProgress: (lessonId, progress) =>
          set(state => ({
            lessons: {
              ...state.lessons,
              [lessonId]: {
                ...state.lessons[lessonId],
                progress,
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

        getLessonProgress: lessonId => get().lessons[lessonId]?.progress || 0,

        getLessonCompleted: lessonId => get().lessons[lessonId]?.completed || false,
      }),
      {
        name: `lesson-progress-store-${userId}`, // Unique storage key per user or context
        partialize: state => ({ lessons: state.lessons }), // Persist only the lessons part of the state
        // You can also specify a storage engine here, like sessionStorage or any custom storage
      },
    ),
  );
};
