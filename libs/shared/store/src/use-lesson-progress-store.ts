import { createStore } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface QuestionProgress {
  [questionId: string]: boolean;
}

interface Lesson {
  progress: number;
  completed: boolean;
  duration: number;
  progressSeconds: number;
  questions: QuestionProgress;
}

type LessonState = {
  lessons: { [lessonId: string]: Lesson };
};

type LessonAction = {
  setLessonComplete: (lessonId: string) => void;
  setLessonProgress: (lessonId: string, progress: number, progressSeconds: number, duration: number) => void;
  setQuestionProgress: (lessonId: string, questionId: string, completed: boolean) => void;
  updateCurrentState: (lessonId: string) => void;
  getLessonProgress: (lessonId: string) => number;
  getLessonDuration: (lessonId: string) => { duration: number; progressSeconds: number };
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

          updateDBLessonProgress(userId, lessonId, 100, true);

          return updatedLessons;
        },
        updateCurrentState: lessonId => {
          const progress = get().lessons[lessonId]?.progress || 0;
          const completed = get().lessons[lessonId]?.completed || false;

          updateDBLessonProgress(userId, lessonId, progress, completed);
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

        getLessonProgress: lessonId => get().lessons[lessonId]?.progress || 0,
        getLessonCompleted: lessonId => get().lessons[lessonId]?.completed || false,
        getLessonDuration: lessonId => {
          const lesson = get().lessons[lessonId];
          return { duration: lesson?.duration || 0, progressSeconds: lesson?.progressSeconds || 0 };
        },
      }),
      {
        name: `lesson-progress-store-${userId}`, // Unique storage key per user or context
        partialize: state => ({ lessons: state.lessons }), // Persist only the lessons part of the state
        // You can also specify a storage engine here, like sessionStorage or any custom storage
      },
    ),
  );
};

const updateDBLessonProgress = async (userId: string, lessonId: string, progress: number, completed: boolean) => {
  try {
    const response = await axios.post('/api/courses/progress', {
      childId: userId,
      lessonId,
      isCompleted: completed,
      currentProgress: progress,
    });
  } catch (error) {
    console.error('Error updating lesson progress:', error);
  }
};

const updateDBQuestionProgress = async (userId: string, lessonId: string, questionId: string, completed: boolean) => {
  try {
    const response = await axios.post('/api/courses/progress', {
      childId: userId,
      lessonId,
      questionId,
      isCompleted: completed,
    });
  } catch (error) {
    console.error('Error updating question progress:', error);
  }
};
