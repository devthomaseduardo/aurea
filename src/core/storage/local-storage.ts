import { APP_CONFIG } from '@/core/config/app.config';

const prefix = APP_CONFIG.storagePrefix;

function key(name: string) {
  return `${prefix}:${name}`;
}

export const localStore = {
  get<T>(name: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key(name));
      if (raw == null) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  set<T>(name: string, value: T): void {
    try {
      localStorage.setItem(key(name), JSON.stringify(value));
    } catch (error) {
      console.error(`[localStore] Failed to persist "${name}"`, error);
    }
  },

  remove(name: string): void {
    localStorage.removeItem(key(name));
  },

  clearAll(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const k = localStorage.key(i);
      if (k?.startsWith(`${prefix}:`)) keysToRemove.push(k);
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  },
};
