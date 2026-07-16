import { beforeEach, describe, expect, it } from 'vitest';
import { pluginsService } from './plugins.service';
import { setStorageUserId } from '@/core/storage/local-storage';

describe('pluginsService', () => {
  beforeEach(() => {
    localStorage.clear();
    setStorageUserId('usr_test');
  });

  it('lista catálogo com runtime', () => {
    const list = pluginsService.listRuntime();
    expect(list.length).toBeGreaterThan(5);
    expect(list.every((p) => p.connection)).toBe(true);
  });

  it('conecta e desconecta plugin', () => {
    pluginsService.connect('gmail');
    expect(pluginsService.getConnected().some((p) => p.id === 'gmail')).toBe(true);

    pluginsService.disconnect('gmail');
    expect(pluginsService.getConnected().some((p) => p.id === 'gmail')).toBe(false);
  });

  it('impede conectar plugin coming soon', () => {
    expect(() => pluginsService.connect('hubspot')).toThrow(/breve/i);
  });
});
