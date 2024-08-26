import { createStore } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

type PointsState = {
  points: number;
};

type PointsAction = {
  addPoints: (points: number) => void;
  resetPoints: () => void;
  getPoints: () => number;
};

export type PointsStore = PointsState & PointsAction;

export const defaultInitState: PointsState = {
  points: 0,
};

export const createPointsStore = (userId: string, courseId: string, initState: PointsState = defaultInitState) =>
  createStore<PointsStore>()(
    persist(
      (set, get) => ({
        ...initState,
        addPoints: (points: number) => {
          const score = set(state => ({
            points: state.points + points,
          }));

          const updateScoreDB = get().points + points;

          updateScore(courseId, userId, updateScoreDB);

          return score;
        },

        resetPoints: () => set({ points: 0 }),

        getPoints: () => get().points,
      }),
      {
        name: `points-storage-${userId}`, // name of the item in storage (must be unique)
        partialize: state => ({ points: state.points }), // Persist only the points part of the state
        // You can also specify a storage engine here, like sessionStorage or any custom storage
      },
    ),
  );

export async function updateScore(courseId: string, childId: string, score: number) {
  try {
    await axios.post('/api/courses/score', {
      childId,
      score,
      courseId,
    });
  } catch (error) {
    console.error('Error updating score:', error);
  }
}
