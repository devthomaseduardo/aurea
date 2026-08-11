import { beforeEach, describe, expect, it } from 'vitest';
import { pluginsService } from './plugins.service';
import { setStorageUserId } from '@/core/storage/local-storage';

describe('pluginsService', () => {
  beforeEach(() => {
    localStorage.clear();
    setStorageUserId('usr_test');
  });

  it('lista catálogo', () => {
    const list = pluginsService.getDefinitions();
    expect(list.length).toBeGreaterThan(5);
    expect(list.every((p) => p.id)).toBe(true);
  });

  it('conecta e desconecta plugin', () => {
    pluginsService.connect('google');
    expect(pluginsService.getConnections().some((p) => p.pluginId === 'google')).toBe(true);

    pluginsService.disconnect('google');
    expect(pluginsService.getConnections().some((p) => p.pluginId === 'google')).toBe(false);
  });
});

