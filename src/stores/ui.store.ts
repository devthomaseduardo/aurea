import { create } from 'zustand';
import { localStore } from '@/core/storage/local-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

interface UiState {
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;
  setSidebarMobileOpen: (v: boolean) => void;
  setTheme: (theme: ThemeMode) => void;
  hydrateTheme: () => void;
}

const THEME_KEY = 'ui_theme';

function systemPrefersDark() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

function applyThemeClass(resolved: 'light' | 'dark') {
  const root = document.documentElement;
  root.classList.toggle('dark', resolved === 'dark');
  root.style.colorScheme = resolved;
  root.dataset.theme = resolved;
}

function resolve(theme: ThemeMode): 'light' | 'dark' {
  if (theme === 'system') return systemPrefersDark() ? 'dark' : 'light';
  return theme;
}

export const useUiStore = create<UiState>((set, get) => ({
  sidebarCollapsed: false,
  sidebarMobileOpen: false,
  theme: 'light',
  resolvedTheme: 'light',

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  setSidebarMobileOpen: (sidebarMobileOpen) => set({ sidebarMobileOpen }),

  setTheme: (theme) => {
    localStore.setGlobal(THEME_KEY, theme);
    const resolvedTheme = resolve(theme);
    applyThemeClass(resolvedTheme);
    set({ theme, resolvedTheme });
  },

  hydrateTheme: () => {
    const saved = localStore.getGlobal<ThemeMode | null>(THEME_KEY, null) ?? 'light';
    const resolvedTheme = resolve(saved);
    applyThemeClass(resolvedTheme);
    set({ theme: saved, resolvedTheme });

    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return;
    const onChange = () => {
      if (get().theme === 'system') {
        const next = resolve('system');
        applyThemeClass(next);
        set({ resolvedTheme: next });
      }
    };
    mq.addEventListener?.('change', onChange);
  },
}));
