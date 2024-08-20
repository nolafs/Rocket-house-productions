import { createStore } from 'zustand';

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
  createStore<PointsStore>((set, get) => ({
    ...initState,
    addPoints: (points: number) =>
      set(state => ({
        points: state.points + points,
      })),

    resetPoints: () => set({ points: 0 }),

    getPoints: () => get().points,
  }));
