import { createStore } from 'zustand';

interface PointsState {
  points: number;
  addPoints: (points: number) => void;
  resetPoints: () => void;
  getPoints: () => number;
}

export const usePointsStore = createStore<PointsState>((set, get) => ({
  points: 0,

  addPoints: points =>
    set(state => ({
      points: state.points + points,
    })),

  resetPoints: () => set({ points: 0 }),

  getPoints: () => get().points,
}));

//export default usePointsStore;
