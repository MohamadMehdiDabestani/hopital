// stores/useUserStore.ts
import { create } from "zustand";

interface User {
  userId: number;
  firstName: string;
  lastName: string;
  siteId: number;
  role: string;
}

interface UserStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
