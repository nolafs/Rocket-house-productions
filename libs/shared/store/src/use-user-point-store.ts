import { createStore } from 'zustand';
import { persist } from 'zustand/middleware';

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

export const createPointsStore = (initState: PointsState = defaultInitState) =>
  createStore<PointsStore>()(
    persist(
      (set, get) => ({
        ...initState,
        addPoints: (points: number) =>
          set(state => ({
            points: state.points + points,
          })),

        resetPoints: () => set({ points: 0 }),

        getPoints: () => get().points,
      }),
      {
        name: 'points-storage', // name of the item in storage (must be unique)
        partialize: state => ({ points: state.points }), // Persist only the points part of the state
        // You can also specify a storage engine here, like sessionStorage or any custom storage
      },
    ),
  );
