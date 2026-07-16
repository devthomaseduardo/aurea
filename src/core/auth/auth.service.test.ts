import { beforeEach, describe, expect, it } from 'vitest';
import { authService } from './auth.service';
import { setStorageUserId } from '@/core/storage/local-storage';

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear();
    setStorageUserId(null);
  });

  it('registra usuário e cria sessão', async () => {
    const user = await authService.register({
      name: 'Ana Silva',
      email: 'ana@empresa.com',
      password: 'senha123',
      companyName: 'Ana Dev',
    });

    expect(user.email).toBe('ana@empresa.com');
    expect(user.provider).toBe('email');
    expect(authService.getSession()?.userId).toBe(user.id);
    expect(authService.getCurrentUser()?.name).toBe('Ana Silva');
  });

  it('impede e-mail duplicado', async () => {
    await authService.register({
      name: 'Ana',
      email: 'ana@empresa.com',
      password: 'senha123',
    });
    await authService.logout();

    await expect(
      authService.register({
        name: 'Outra',
        email: 'ana@empresa.com',
        password: 'senha123',
      })
    ).rejects.toThrow(/já existe/i);
  });

  it('faz login e logout', async () => {
    await authService.register({
      name: 'Bruno',
      email: 'bruno@empresa.com',
      password: 'senha123',
    });
    await authService.logout();
    expect(authService.getSession()).toBeNull();

    const user = await authService.login({
      email: 'bruno@empresa.com',
      password: 'senha123',
    });
    expect(user.name).toBe('Bruno');
    expect(authService.getSession()).not.toBeNull();

    await authService.logout();
    expect(authService.getCurrentUser()).toBeNull();
  });

  it('rejeita senha inválida', async () => {
    await authService.register({
      name: 'Carla',
      email: 'carla@empresa.com',
      password: 'senha123',
    });
    await authService.logout();

    await expect(
      authService.login({ email: 'carla@empresa.com', password: 'errada' })
    ).rejects.toThrow(/inválidos/i);
  });

  it('login social local (google/github) cria conta isolada', async () => {
    const google = await authService.loginWithProvider('google');
    expect(google).not.toBe('redirect');
    if (google === 'redirect') return;
    expect(google.provider).toBe('google');
    expect(authService.getSession()?.provider).toBe('google');

    await authService.logout();

    const github = await authService.loginWithProvider('github');
    expect(github).not.toBe('redirect');
    if (github === 'redirect') return;
    expect(github.provider).toBe('github');
    expect(github.id).not.toBe(google.id);
  });
});
