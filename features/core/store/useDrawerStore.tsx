import { create } from "zustand";

const DRAWER_WIDTH = 240;
const MINI_DRAWER_WIDTH = 72;

type DrawerState = {
  open: boolean;
  setOpen: (open: boolean) => void;
  drawerWidth: number;
};

export const useDrawerStore = create<DrawerState>((set) => ({
  open: false,
  drawerWidth: 70,
  setOpen: (open) =>
    set({ open, drawerWidth: open ? DRAWER_WIDTH : MINI_DRAWER_WIDTH }),
}));
