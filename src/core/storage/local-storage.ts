import { APP_CONFIG } from '@/core/config/app.config';

const appPrefix = APP_CONFIG.storagePrefix;

let activeUserId: string | null = null;

export function setStorageUserId(userId: string | null) {
  activeUserId = userId;
}

export function getStorageUserId() {
  return activeUserId;
}

function key(name: string, scoped = true) {
  if (scoped && activeUserId) {
    return `${appPrefix}:u:${activeUserId}:${name}`;
  }
  return `${appPrefix}:global:${name}`;
}

export const localStore = {
  /** User-scoped data (clients, proposals, etc.) */
  get<T>(name: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key(name, true));
      if (raw == null) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  set<T>(name: string, value: T): void {
    try {
      localStorage.setItem(key(name, true), JSON.stringify(value));
    } catch (error) {
      console.error(`[localStore] Failed to persist "${name}"`, error);
    }
  },

  remove(name: string): void {
    localStorage.removeItem(key(name, true));
  },

  /** Global (non-user) data — auth users registry, session */
  getGlobal<T>(name: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key(name, false));
      if (raw == null) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  setGlobal<T>(name: string, value: T): void {
    try {
      localStorage.setItem(key(name, false), JSON.stringify(value));
    } catch (error) {
      console.error(`[localStore] Failed to persist global "${name}"`, error);
    }
  },

  removeGlobal(name: string): void {
    localStorage.removeItem(key(name, false));
  },

  clearUserData(userId?: string): void {
    const uid = userId ?? activeUserId;
    if (!uid) return;
    const userPrefix = `${appPrefix}:u:${uid}:`;
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const k = localStorage.key(i);
      if (k?.startsWith(userPrefix)) keysToRemove.push(k);
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  },

  clearAll(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const k = localStorage.key(i);
      if (k?.startsWith(`${appPrefix}:`)) keysToRemove.push(k);
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  },
};
