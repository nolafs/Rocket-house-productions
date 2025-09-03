import { create } from 'zustand';

interface MenuState {
  active: boolean;
  setActive: (value: boolean) => void;
}

export const useMenuActive = create<MenuState>(set => ({
  active: false,
  setActive: (value: boolean) => set(state => ({ active: value })),
}));
