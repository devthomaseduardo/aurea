import { localStore } from '@/core/storage/local-storage';
import type {
  PluginConnection,
  PluginDefinition,
  PluginRuntime,
} from '@/types/plugins';

const KEY = 'plugin_connections';

export const PLUGIN_CATALOG: PluginDefinition[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Envie propostas e follow-ups diretamente da caixa de entrada.',
    category: 'communication',
    icon: 'Mail',
    website: 'https://gmail.com',
    oauthReady: true,
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Sincronize reuniões e prazos de entrega com o cronograma.',
    category: 'calendar',
    icon: 'Calendar',
    website: 'https://calendar.google.com',
    oauthReady: true,
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Receba pagamentos de propostas aceitas e emita cobranças.',
    category: 'payments',
    icon: 'CreditCard',
    website: 'https://stripe.com',
    oauthReady: true,
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Exporte briefs e propostas para workspaces Notion.',
    category: 'productivity',
    icon: 'Notebook',
    website: 'https://notion.so',
    oauthReady: true,
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Receba alertas de propostas e contratos no canal do time.',
    category: 'communication',
    icon: 'MessageSquare',
    website: 'https://slack.com',
    oauthReady: true,
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Vincule repositórios a projetos e contratos ativos.',
    category: 'productivity',
    icon: 'Github',
    website: 'https://github.com',
    oauthReady: true,
  },
  {
    id: 'whatsapp-business',
    name: 'WhatsApp Business',
    description: 'Notifique clientes sobre status de propostas (API oficial).',
    category: 'communication',
    icon: 'Phone',
    website: 'https://business.whatsapp.com',
    oauthReady: true,
  },
  {
    id: 'hubspot',
    name: 'HubSpot CRM',
    description: 'Sincronize leads e deals com o CRM corporativo.',
    category: 'crm',
    icon: 'Building2',
    website: 'https://hubspot.com',
    comingSoon: true,
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Arquive PDFs de propostas e contratos na nuvem.',
    category: 'storage',
    icon: 'HardDrive',
    website: 'https://drive.google.com',
    comingSoon: true,
  },
];

function getConnections(): PluginConnection[] {
  return localStore.get<PluginConnection[]>(KEY, []);
}

function saveConnections(list: PluginConnection[]) {
  localStore.set(KEY, list);
}

export const pluginsService = {
  listCatalog(): PluginDefinition[] {
    return PLUGIN_CATALOG;
  },

  listRuntime(): PluginRuntime[] {
    const connections = getConnections();
    return PLUGIN_CATALOG.map((plugin) => {
      const connection = connections.find((c) => c.pluginId === plugin.id);
      return {
        ...plugin,
        connection: connection ?? {
          pluginId: plugin.id,
          status: plugin.comingSoon ? 'coming_soon' : 'available',
        },
      };
    });
  },

  getConnected(): PluginRuntime[] {
    return this.listRuntime().filter((p) => p.connection?.status === 'connected');
  },

  /** Simulated OAuth connect — ready to swap for real OAuth later */
  connect(
    pluginId: string,
    opts?: { accountLabel?: string; config?: Record<string, string> }
  ): PluginConnection {
    const plugin = PLUGIN_CATALOG.find((p) => p.id === pluginId);
    if (!plugin) throw new Error('Plugin não encontrado');
    if (plugin.comingSoon) throw new Error('Este plugin estará disponível em breve');

    const connections = getConnections().filter((c) => c.pluginId !== pluginId);
    const connection: PluginConnection = {
      pluginId,
      status: 'connected',
      connectedAt: new Date().toISOString(),
      lastSyncAt: new Date().toISOString(),
      accountLabel: opts?.accountLabel ?? `${plugin.name} · conta conectada`,
      config: opts?.config ?? {},
    };
    saveConnections([...connections, connection]);
    return connection;
  },

  disconnect(pluginId: string): void {
    const next = getConnections().filter((c) => c.pluginId !== pluginId);
    saveConnections(next);
  },

  sync(pluginId: string): PluginConnection {
    const connections = getConnections();
    const idx = connections.findIndex((c) => c.pluginId === pluginId);
    if (idx < 0) throw new Error('Plugin não conectado');
    connections[idx] = {
      ...connections[idx],
      lastSyncAt: new Date().toISOString(),
      status: 'connected',
      error: undefined,
    };
    saveConnections(connections);
    return connections[idx];
  },
};
