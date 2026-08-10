import { localStore } from '@/core/storage/local-storage';
import type {
  PluginConnection,
  PluginDefinition,
} from '@/types/plugins';
import { isCloudDataEnabled } from '@/core/db/mode';
import {
  listCollection,
  setDocument,
  removeDocument,
} from '@/core/firebase/user-repo';

const KEY = 'plugins';

const DEFINITIONS: PluginDefinition[] = [
  {
    id: 'google',
    name: 'Google',
    description: 'Login e drive via OAuth Google',
    category: 'auth',
    icon: 'google',
    oauth: true,
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Login e repos via OAuth GitHub',
    category: 'auth',
    icon: 'github',
    oauth: true,
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Pagamentos e cobrança',
    category: 'payments',
    icon: 'stripe',
    oauth: false,
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Notificações e canais',
    category: 'comms',
    icon: 'slack',
    oauth: false,
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Docs e bases de conhecimento',
    category: 'productivity',
    icon: 'notion',
    oauth: false,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Mensagens via API Business',
    category: 'comms',
    icon: 'whatsapp',
    oauth: false,
  },
];

function loadConnections(): PluginConnection[] {
  const existing = localStore.get<PluginConnection[] | null>(KEY, null);
  if (existing) return existing;
  return [];
}

function saveConnections(list: PluginConnection[]) {
  localStore.set(KEY, list);
  if (isCloudDataEnabled()) {
    void setDocument('plugins', 'connections', { list });
  }
}

export const pluginsService = {
  getDefinitions(): PluginDefinition[] {
    return DEFINITIONS;
  },

  getConnections(): PluginConnection[] {
    return loadConnections();
  },

  async loadFromCloud(): Promise<PluginConnection[]> {
    if (isCloudDataEnabled()) {
      await listCollection<{ list: PluginConnection[] }>('plugins');
    }
    return loadConnections();
  },

  connectWithToken(
    pluginId: string,
    data: { accessToken?: string; accountLabel?: string; provider?: string } = {}
  ): Promise<PluginConnection> {
    const conn = this.connect(pluginId, data.accessToken);
    if (data.accountLabel) {
      const list = loadConnections();
      const next = list.map((c) =>
        c.pluginId === pluginId ? { ...c, accountLabel: data.accountLabel } : c
      );
      saveConnections(next);
      return Promise.resolve(next.find((c) => c.pluginId === pluginId)!);
    }
    return Promise.resolve(conn);
  },

  isConnected(pluginId: string): boolean {
    return loadConnections().some(
      (c) => c.pluginId === pluginId && (c.connected || c.status === 'connected')
    );
  },

  getAccessToken(pluginId: string): string | null {
    const c = loadConnections().find((x) => x.pluginId === pluginId);
    return c?.accessToken ?? null;
  },

  connect(pluginId: string, accessToken?: string): PluginConnection {
    const list = loadConnections();
    const existing = list.find((c) => c.pluginId === pluginId);
    const conn: PluginConnection = {
      pluginId,
      status: 'connected',
      connected: true,
      accessToken: accessToken || existing?.accessToken || 'local-token',
      connectedAt: new Date().toISOString(),
      lastSyncAt: null,
    };
    const next = existing
      ? list.map((c) => (c.pluginId === pluginId ? conn : c))
      : [...list, conn];
    saveConnections(next);
    if (isCloudDataEnabled()) {
      void setDocument('plugins', pluginId, conn);
    }
    return conn;
  },

  disconnect(pluginId: string): boolean {
    const list = loadConnections();
    const next = list.filter((c) => c.pluginId !== pluginId);
    if (next.length === list.length) return false;
    saveConnections(next);
    if (isCloudDataEnabled()) {
      void removeDocument('plugins', pluginId);
    }
    return true;
  },

  sync(pluginId: string): void {
    const list = loadConnections();
    const next = list.map((c) =>
      c.pluginId === pluginId ? { ...c, lastSyncAt: new Date().toISOString() } : c
    );
    saveConnections(next);
  },

  async testConnection(pluginId: string): Promise<string> {
    if (!this.isConnected(pluginId)) throw new Error('Plugin não conectado');
    if (pluginId === 'google' || pluginId === 'github') {
      return 'OAuth OK (local/demo)';
    }
    if (pluginId === 'stripe') {
      const secret = this.getAccessToken('stripe');
      if (!secret) throw new Error('Sem chave Stripe');
      return 'Stripe OK (demo)';
    }
    if (pluginId === 'slack') {
      return 'Slack OK (demo)';
    }
    this.sync(pluginId);
    return 'Marcação de sync atualizada';
  },
};
