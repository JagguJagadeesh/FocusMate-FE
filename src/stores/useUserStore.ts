import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type User = {
  id: string;
  name: string;
  email: string;
};

type TaskStats = {
  completed: number;
  pending: number;
};

type UserStore = {
  user: User;
  hasHydrated: boolean;
  taskStats: TaskStats;
  setUser: (user: User) => void;
  clearUser: () => void;
  setTaskStats: (stats: TaskStats) => void;
};

const initialUser: User = {
  id: "",
  name: "",
  email: ""
};

const initialStats: TaskStats = {
  completed: 0,
  pending: 0,
};

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: initialUser,
      hasHydrated: false,
      taskStats: initialStats,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: initialUser, taskStats: initialStats }),
      setTaskStats: (stats) => set({ taskStats: stats }),
    }),
    {
      name: 'user-store',
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true;
      },
    }
  )
);

export default useUserStore;
