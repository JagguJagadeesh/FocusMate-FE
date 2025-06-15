import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type User = {
  id: string;
  name: string;
  email: string;
};

type UserStore = {
  user: User;
  hasHydrated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
};

const initialUser: User = {
  id: "",
  name: "",
  email: ""
};

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: initialUser,
      hasHydrated: false,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: initialUser }),
    }),
    {
      name: 'user-store',
      onRehydrateStorage: () => (state) => {
        if(state) state.hasHydrated = true;
      },
    }
  )
);

export default useUserStore;
