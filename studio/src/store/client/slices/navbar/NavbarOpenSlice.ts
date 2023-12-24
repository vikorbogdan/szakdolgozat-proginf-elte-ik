import { StateCreator } from "zustand";

export interface NavBarOpenSlice {
  navbarOpen: boolean;
  setNavbarOpen: (navbarOpen: boolean) => void;
  toggleNavbarOpen: () => void;
}

// A slice for tracking whether the navbar is open or not
export const createNavbarOpenSlice: StateCreator<NavBarOpenSlice> = (
  set,
  get
) => ({
  navbarOpen: false,
  setNavbarOpen: (navbarOpen) => set({ navbarOpen }),
  toggleNavbarOpen: () => set({ navbarOpen: !get().navbarOpen }),
});
