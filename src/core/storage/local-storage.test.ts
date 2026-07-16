import { beforeEach, describe, expect, it } from 'vitest';
import { localStore, setStorageUserId } from './local-storage';
import { APP_CONFIG } from '@/core/config/app.config';

describe('localStore', () => {
  beforeEach(() => {
    localStorage.clear();
    setStorageUserId(null);
  });

  it('retorna fallback quando a chave não existe', () => {
    expect(localStore.get('missing', { ok: true })).toEqual({ ok: true });
  });

  it('persiste dados por usuário', () => {
    setStorageUserId('usr_a');
    localStore.set('clients', [{ id: 1 }]);
    expect(localStore.get('clients', [])).toEqual([{ id: 1 }]);

    setStorageUserId('usr_b');
    expect(localStore.get('clients', [])).toEqual([]);
    localStore.set('clients', [{ id: 2 }]);

    setStorageUserId('usr_a');
    expect(localStore.get('clients', [])).toEqual([{ id: 1 }]);
  });

  it('persiste dados globais de auth', () => {
    localStore.setGlobal('auth_users', [{ email: 'a@b.com' }]);
    expect(localStore.getGlobal('auth_users', [])).toEqual([{ email: 'a@b.com' }]);
    expect(localStorage.getItem(`${APP_CONFIG.storagePrefix}:global:auth_users`)).toContain(
      'a@b.com'
    );
  });

  it('limpa apenas dados do usuário', () => {
    setStorageUserId('usr_a');
    localStore.set('x', 1);
    localStore.setGlobal('session', { t: 1 });
    localStore.clearUserData('usr_a');
    expect(localStore.get('x', null)).toBeNull();
    expect(localStore.getGlobal('session', null)).toEqual({ t: 1 });
  });

  it('retorna fallback se o JSON estiver corrompido', () => {
    setStorageUserId('usr_a');
    localStorage.setItem(`${APP_CONFIG.storagePrefix}:u:usr_a:broken`, '{not-json');
    expect(localStore.get('broken', 'fallback')).toBe('fallback');
  });
});
