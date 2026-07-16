import { describe, expect, it } from 'vitest';
import { localStore } from './local-storage';
import { APP_CONFIG } from '@/core/config/app.config';

describe('localStore', () => {
  it('retorna fallback quando a chave não existe', () => {
    expect(localStore.get('missing', { ok: true })).toEqual({ ok: true });
  });

  it('persiste e recupera valores JSON', () => {
    localStore.set('user', { name: 'Thomas' });
    expect(localStore.get('user', null)).toEqual({ name: 'Thomas' });
    expect(localStorage.getItem(`${APP_CONFIG.storagePrefix}:user`)).toContain('Thomas');
  });

  it('remove chaves individualmente', () => {
    localStore.set('temp', 1);
    localStore.remove('temp');
    expect(localStore.get('temp', null)).toBeNull();
  });

  it('limpa todas as chaves do prefixo do app', () => {
    localStore.set('a', 1);
    localStore.set('b', 2);
    localStorage.setItem('other:app', 'keep');
    localStore.clearAll();

    expect(localStore.get('a', null)).toBeNull();
    expect(localStore.get('b', null)).toBeNull();
    expect(localStorage.getItem('other:app')).toBe('keep');
  });

  it('retorna fallback se o JSON estiver corrompido', () => {
    localStorage.setItem(`${APP_CONFIG.storagePrefix}:broken`, '{not-json');
    expect(localStore.get('broken', 'fallback')).toBe('fallback');
  });
});
