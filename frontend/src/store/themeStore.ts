import { create } from "zustand";

type ThemeState = {
    theme: 'dark' | 'light';
    toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>(
    (set) => ({
        theme:
            typeof window != 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light',

        toggleTheme: () =>
            set((state) => {
                const newTheme = state.theme === 'light' ? 'dark' : 'light';
                document.documentElement.classList.remove(state.theme);
                document.documentElement.classList.add(newTheme);
                return { theme: newTheme };
            })
    })
)
