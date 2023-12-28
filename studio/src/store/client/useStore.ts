import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LessonSlice, createLessonSlice } from "./slices/navbar/LessonSlice";
import {
  NavBarOpenSlice,
  createNavbarOpenSlice,
} from "./slices/navbar/NavbarOpenSlice";

export const useNavbarStore = create<NavBarOpenSlice & LessonSlice>()(
  persist(
    (...a) => ({
      ...createNavbarOpenSlice(...a),
      ...createLessonSlice(...a),
    }),
    {
      name: "navbar-data",
    }
  )
);
