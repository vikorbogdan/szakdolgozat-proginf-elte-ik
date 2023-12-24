import { create } from "zustand";
import {
  NavBarOpenSlice,
  createNavbarOpenSlice,
} from "./slices/navbar/NavbarOpenSlice";
import { LessonSlice, createLessonSlice } from "./slices/navbar/LessonSlice";

export const useNavbarStore = create<NavBarOpenSlice & LessonSlice>()(
  (...a) => ({
    ...createNavbarOpenSlice(...a),
    ...createLessonSlice(...a),
  })
);
