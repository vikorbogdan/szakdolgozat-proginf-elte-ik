import { Lesson } from "@prisma/client";
import { StateCreator } from "zustand";

export interface LessonSlice {
  onGoing: boolean;
  setOnGoing: (onGoing: boolean) => void;
  toggleOnGoing: () => void;
  lesson: Lesson | null;
  setLesson: (lesson: Lesson | null) => void;
}

// A slice for tracking the current lesson and whether it is ongoing or not
export const createLessonSlice: StateCreator<LessonSlice> = (set, get) => ({
  onGoing: false,
  setOnGoing: (onGoing) => set({ onGoing }),
  toggleOnGoing: () => set({ onGoing: !get().onGoing }),
  lesson: null,
  setLesson: (lesson) => set({ lesson }),
});
