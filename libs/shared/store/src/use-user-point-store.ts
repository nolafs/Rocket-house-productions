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
  syncPointsWithDB: () => void;
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
          const newPoints = get().points + points;
          set({ points: newPoints });

          updateScore(courseId, userId, newPoints);
        },

        resetPoints: () => set({ points: 0 }),

        getPoints: () => get().points,
        syncPointsWithDB: async () => {
          try {
            const localPoints = get().points;
            const { score: remotePoints } = await getScore(courseId, userId);

            if (localPoints !== remotePoints) {
              set({ points: remotePoints }); // Sync local points with the database
            }
          } catch (error) {
            console.error('Error syncing points:', error);
          }
        },
      }),
      {
        name: `points-storage-${userId}`, // name of the item in storage (must be unique)
        partialize: state => ({ points: state.points }), // Persist only the points part of the state
        onRehydrateStorage: () => state => {
          console.log('Rehydrated points store:', state);
          if (state) state.syncPointsWithDB?.(); // Sync after rehydration
        },
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

export async function getScore(courseId: string, childId: string) {
  try {
    console.log('Getting score for:', courseId, childId);
    const response = await axios.get(`/api/courses/score?childId=${childId}&courseId=${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting score:', error);
    return { score: 0 }; // Default to 0 if there's an error
  }
}
