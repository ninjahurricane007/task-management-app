import { create } from "zustand";
import { persist } from "zustand/middleware";
import { clearTokens } from "@/lib/token";

interface AuthState {
  isLogin: boolean;
  hasHydrated: boolean;
  login: () => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLogin: false,
      hasHydrated: false,
      login: () => set({ isLogin: true }),
      logout: () => {
        clearTokens();
        set({ isLogin: false });
      },
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "auth",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
