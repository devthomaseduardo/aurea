import { create } from 'zustand';
import { authService } from '@/core/auth/auth.service';
import type { AuthUser, LoginInput, RegisterInput } from '@/types/auth';
import { setStorageUserId } from '@/core/storage/local-storage';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isLoading: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  setFromSocial: (provider: 'google' | 'github') => Promise<'redirect' | AuthUser>;
  completeOAuth: () => Promise<AuthUser | null>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,
  isLoading: false,
  error: null,

  hydrate: async () => {
    try {
      const user = await authService.getCurrentUserAsync();
      if (user) setStorageUserId(user.id);
      set({
        user,
        isAuthenticated: Boolean(user),
        isHydrated: true,
      });

      // Keep session in sync with Firebase
      authService.onAuthChanged((u) => {
        if (u) setStorageUserId(u.id);
        else setStorageUserId(null);
        set({ user: u, isAuthenticated: Boolean(u) });
      });
    } catch {
      set({ user: null, isAuthenticated: false, isHydrated: true });
    }
  },

  login: async (input) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.login(input);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (e) {
      set({
        isLoading: false,
        error: e instanceof Error ? e.message : 'Falha no login',
      });
      throw e;
    }
  },

  register: async (input) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.register(input);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (e) {
      set({
        isLoading: false,
        error: e instanceof Error ? e.message : 'Falha no cadastro',
      });
      throw e;
    }
  },

  setFromSocial: async (provider) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authService.loginWithProvider(provider);
      if (result === 'redirect') {
        set({ isLoading: false });
        return 'redirect';
      }
      set({ user: result, isAuthenticated: true, isLoading: false });
      return result;
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : 'Falha no login social. Verifique Firebase Auth (Google/GitHub).';
      set({ isLoading: false, error: message });
      throw e;
    }
  },

  completeOAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.completeOAuthCallback();
      if (user) set({ user, isAuthenticated: true, isLoading: false });
      else set({ isLoading: false });
      return user;
    } catch (e) {
      set({
        isLoading: false,
        error: e instanceof Error ? e.message : 'Falha no OAuth',
      });
      throw e;
    }
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, isAuthenticated: false, error: null });
  },

  clearError: () => set({ error: null }),
}));
