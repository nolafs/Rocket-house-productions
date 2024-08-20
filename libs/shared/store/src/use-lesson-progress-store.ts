import { createStore } from 'zustand';

interface QuestionProgress {
  [questionId: string]: boolean;
}

interface Lesson {
  progress: number;
  questions: QuestionProgress;
}

type LessonState = {
  lessons: { [lessonId: string]: Lesson };
};

type LessonAction = {
  setLessonProgress: (lessonId: string, progress: number) => void;
  setQuestionProgress: (lessonId: string, questionId: string, completed: boolean) => void;
  getLessonProgress: (lessonId: string) => number;
};

export type LessonProgressStore = LessonState & LessonAction;

export const defaultInitState: LessonState = {
  lessons: {},
};

export const createLessonStore = (initState: LessonState = defaultInitState) => {
  return createStore<LessonProgressStore>((set, get) => ({
    ...initState,

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
  }));
};
