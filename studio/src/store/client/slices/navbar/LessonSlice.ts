import moment from "moment";
import { StateCreator } from "zustand";

export interface LessonSlice {
  onGoingLessonId: string | null;
  setOnGoingLessonId: (onGoingLessonId: string | null) => void;
  onGoingLessonDuration: number;
  setOnGoingLessonDuration: (onGoingLessonDuration: number) => void;
  setElapsedTime: (elapsedTime: number) => void;
  setProgress: (progress: number) => void;
  elapsedTime: number;
  startElapsedTimeTimer: () => void;
  stopElapsedTimeTimer: () => void;
  progress: number;
  resetLesson: () => void;
  startTimeStamp: number | null;
  continueElapsedTimeTimer: () => void;
}

const initialLessonState = {
  onGoingLessonDuration: 0,
  onGoingLessonId: null,
  elapsedTime: 0,
  progress: 0,
  startTimeStamp: null,
};

export const createLessonSlice: StateCreator<LessonSlice> = (set, get) => {
  let interval: NodeJS.Timeout | null = null;

  return {
    ...initialLessonState,
    setOnGoingLessonDuration: (onGoingLessonDuration) =>
      set({ onGoingLessonDuration: onGoingLessonDuration }),
    setOnGoingLessonId: (onGoingLessonId) => set({ onGoingLessonId }),
    setElapsedTime: (elapsedTime) => set({ elapsedTime }),
    setProgress: (progress) => set({ progress }),
    resetLesson: () => {
      get().stopElapsedTimeTimer();
      set(initialLessonState);
    },
    startElapsedTimeTimer: () => {
      if (interval) clearInterval(interval);
      set({ startTimeStamp: moment.now() });
      interval = setInterval(() => {
        const elapsedTime = moment(moment.now()).diff(get().startTimeStamp);
        set({ elapsedTime: Math.floor(elapsedTime / 1000) * 1000 });
      }, 1000);
    },
    stopElapsedTimeTimer: () => {
      if (interval) clearInterval(interval);
      interval = null;
      set({ elapsedTime: 0 });
    },
    continueElapsedTimeTimer: () => {
      if (interval) clearInterval(interval);
      interval = setInterval(() => {
        const elapsedTime = moment(moment.now()).diff(get().startTimeStamp);
        set({ elapsedTime: Math.floor(elapsedTime / 1000) * 1000 });
      }, 1000);
    },
  };
};
