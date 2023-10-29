import { create } from "zustand";
import {
  NavBarOpenSlice,
  createNavbarOpenSlice,
} from "./createNavbarOpenSlice";

export const useClientStore = create<NavBarOpenSlice>()((...a) => ({
  ...createNavbarOpenSlice(...a),
}));
