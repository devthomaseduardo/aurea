import { localStore } from '@/core/storage/local-storage';
import type {
  PluginConnection,
  PluginDefinition,
  PluginRuntime,
} from '@/types/plugins';
import { useCloudData } from '@/core/db/mode';
import {
  listCollection,
  setDocument,
  removeDocument,
} from '@/core/firebase/user-repo';
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  linkWithPopup,
  reauthenticateWithPopup,
  type User,
} from 'firebase/auth';
import { getFirebaseAuth, requireAuth } from '@/core/firebase/app';
import { isCloudAuth } from '@/core/auth/auth.service';

const KEY = 'plugin_connections';

export const PLUGIN_CATALOG: PluginDefinition[] = [
  {
    id: 'google-workspace',
    name: 'Google Workspace',
    description:
      'Gmail + Calendar em uma conexão. Envie propostas e agende reuniões com OAuth real.',
    category: 'communication',
    icon: 'Mail',
    website: 'https://workspace.google.com',
    oauthReady: true,
  },
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Envie propostas e follow-ups (usa Google Workspace se conectado).',
    category: 'communication',
    icon: 'Mail',
    website: 'https://gmail.com',
    oauthReady: true,
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Crie eventos de kickoff e prazos a partir do cronograma.',
    category: 'calendar',
    icon: 'Calendar',
    website: 'https://calendar.google.com',
    oauthReady: true,
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Vincule repositórios e issues a projetos e contratos.',
    category: 'productivity',
    icon: 'Github',
    website: 'https://github.com',
    oauthReady: true,
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Gere links de pagamento para propostas aceitas.',
    category: 'payments',
    icon: 'CreditCard',
    website: 'https://stripe.com',
    oauthReady: true,
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Exporte propostas para páginas Notion (token de integração).',
    category: 'productivity',
    icon: 'Notebook',
    website: 'https://notion.so',
    oauthReady: true,
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Webhook para alertas de propostas no canal do time.',
    category: 'communication',
    icon: 'MessageSquare',
    website: 'https://slack.com',
    oauthReady: true,
  },
  {
    id: 'whatsapp-business',
    name: 'WhatsApp Business',
    description: 'Notifique clientes (webhook / API Cloud).',
    category: 'communication',
    icon: 'Phone',
    website: 'https://business.whatsapp.com',
    oauthReady: true,
  },
  {
    id: 'hubspot',
    name: 'HubSpot CRM',
    description: 'Sincronize leads e deals.',
    category: 'crm',
    icon: 'Building2',
    website: 'https://hubspot.com',
    comingSoon: true,
  },
];

async function loadConnections(): Promise<PluginConnection[]> {
  if (useCloudData()) {
    const items = await listCollection<PluginConnection & { id: string }>('plugins');
    const mapped = items.map(({ id, ...rest }) => ({
      ...rest,
      pluginId: rest.pluginId || id,
    }));
    localStore.set(KEY, mapped);
    return mapped;
  }
  return localStore.get<PluginConnection[]>(KEY, []);
}

async function saveConnections(list: PluginConnection[]): Promise<void> {
  localStore.set(KEY, list);
  if (useCloudData()) {
    await Promise.all(
      list.map((c) => setDocument('plugins', c.pluginId, c))
    );
  }
}

function getConnectionsSync(): PluginConnection[] {
  return localStore.get<PluginConnection[]>(KEY, []);
}

export const pluginsService = {
  listCatalog(): PluginDefinition[] {
    return PLUGIN_CATALOG;
  },

  listRuntime(): PluginRuntime[] {
    const connections = getConnectionsSync();
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

  async listRuntimeAsync(): Promise<PluginRuntime[]> {
    const connections = await loadConnections();
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

  async connectWithToken(
    pluginId: string,
    opts: {
      accessToken: string;
      refreshToken?: string;
      accountLabel?: string;
      provider?: string;
      config?: Record<string, string>;
    }
  ): Promise<PluginConnection> {
    const list = await loadConnections();
    const filtered = list.filter((c) => c.pluginId !== pluginId);
    // Also mirror google-workspace → gmail + calendar
    const connection: PluginConnection = {
      pluginId,
      status: 'connected',
      connectedAt: new Date().toISOString(),
      lastSyncAt: new Date().toISOString(),
      accountLabel: opts.accountLabel ?? pluginId,
      config: {
        ...opts.config,
        accessToken: opts.accessToken,
        refreshToken: opts.refreshToken ?? '',
        provider: opts.provider ?? '',
      },
    };
    let next = [...filtered, connection];

    if (pluginId === 'google-workspace') {
      for (const id of ['gmail', 'google-calendar']) {
        next = next.filter((c) => c.pluginId !== id);
        next.push({
          ...connection,
          pluginId: id,
          accountLabel: opts.accountLabel ?? id,
        });
      }
    }

    await saveConnections(next);
    return connection;
  },

  /**
   * Real connector connect via Firebase OAuth popup + scopes
   */
  async connectLive(pluginId: string): Promise<PluginConnection> {
    const plugin = PLUGIN_CATALOG.find((p) => p.id === pluginId);
    if (!plugin) throw new Error('Plugin não encontrado');
    if (plugin.comingSoon) throw new Error('Este plugin estará disponível em breve');

    if (!isCloudAuth()) {
      // Local demo connect
      return this.connect(pluginId, {
        accountLabel: `${plugin.name} · demo local`,
      });
    }

    const auth = requireAuth();
    const user = auth.currentUser;
    if (!user) throw new Error('Faça login para conectar plugins.');

    if (
      pluginId === 'google-workspace' ||
      pluginId === 'gmail' ||
      pluginId === 'google-calendar'
    ) {
      return this.connectGoogle(user, pluginId);
    }

    if (pluginId === 'github') {
      return this.connectGithub(user);
    }

    if (pluginId === 'stripe') {
      return this.connectStripeManual();
    }

    if (pluginId === 'slack') {
      return this.connectWithSecretPrompt({
        pluginId: 'slack',
        title: 'Slack Incoming Webhook',
        hint: 'Cole a URL do Incoming Webhook (https://hooks.slack.com/...)',
        validate: (v) => v.startsWith('https://hooks.slack.com/'),
        accountLabel: 'Slack · webhook',
        provider: 'slack',
      });
    }

    if (pluginId === 'notion') {
      return this.connectWithSecretPrompt({
        pluginId: 'notion',
        title: 'Notion Integration Token',
        hint: 'Cole o token secret_… da integração Notion',
        validate: (v) => v.startsWith('secret_') || v.startsWith('ntn_'),
        accountLabel: 'Notion · integração',
        provider: 'notion',
      });
    }

    if (pluginId === 'whatsapp-business') {
      return this.connectWithSecretPrompt({
        pluginId: 'whatsapp-business',
        title: 'WhatsApp Business webhook/API',
        hint: 'Cole a URL do webhook ou token da Cloud API',
        validate: (v) => v.length >= 8,
        accountLabel: 'WhatsApp Business',
        provider: 'whatsapp',
      });
    }

    return this.connect(pluginId);
  },

  async connectWithSecretPrompt(opts: {
    pluginId: string;
    title: string;
    hint: string;
    validate: (v: string) => boolean;
    accountLabel: string;
    provider: string;
  }): Promise<PluginConnection> {
    const value = window.prompt(`${opts.title}\n\n${opts.hint}`);
    if (!value || !opts.validate(value.trim())) {
      throw new Error(`Valor inválido para ${opts.title}.`);
    }
    return this.connectWithToken(opts.pluginId, {
      accessToken: value.trim(),
      accountLabel: opts.accountLabel,
      provider: opts.provider,
    });
  },

  async connectGoogle(user: User, pluginId: string): Promise<PluginConnection> {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    provider.addScope('https://www.googleapis.com/auth/gmail.send');
    provider.addScope('https://www.googleapis.com/auth/calendar.events');
    provider.setCustomParameters({ prompt: 'consent', access_type: 'offline' });

    let result;
    try {
      result = await linkWithPopup(user, provider);
    } catch {
      result = await reauthenticateWithPopup(user, provider);
    }

    const cred = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = cred?.accessToken;
    if (!accessToken) throw new Error('Google não retornou access token. Verifique o OAuth consent.');

    const target =
      pluginId === 'gmail' || pluginId === 'google-calendar'
        ? 'google-workspace'
        : pluginId;

    return this.connectWithToken(target, {
      accessToken,
      accountLabel: result.user.email || 'Google',
      provider: 'google',
    });
  },

  async connectGithub(user: User): Promise<PluginConnection> {
    const provider = new GithubAuthProvider();
    provider.addScope('read:user');
    provider.addScope('repo');

    let result;
    try {
      result = await linkWithPopup(user, provider);
    } catch {
      result = await reauthenticateWithPopup(user, provider);
    }

    const cred = GithubAuthProvider.credentialFromResult(result);
    const accessToken = cred?.accessToken;
    if (!accessToken) throw new Error('GitHub não retornou access token.');

    const ghLabel =
      result.user.displayName ||
      result.user.providerData.find((p) => p.providerId === 'github.com')?.displayName ||
      result.user.email ||
      'GitHub';

    return this.connectWithToken('github', {
      accessToken,
      accountLabel: ghLabel,
      provider: 'github',
    });
  },

  async connectStripeManual(): Promise<PluginConnection> {
    // Stripe Connect typically needs server secret; store publishable setup flag
    const key = window.prompt(
      'Cole sua Stripe Secret Key de teste (sk_test_...) para gerar Payment Links. Em produção use variável de servidor.'
    );
    if (!key || !key.startsWith('sk_')) {
      throw new Error('Chave Stripe inválida. Use sk_test_... ou configure no backend.');
    }
    return this.connectWithToken('stripe', {
      accessToken: key,
      accountLabel: 'Stripe · chave configurada',
      provider: 'stripe',
    });
  },

  /** Legacy simple connect (no token) */
  connect(
    pluginId: string,
    opts?: { accountLabel?: string; config?: Record<string, string> }
  ): PluginConnection {
    const plugin = PLUGIN_CATALOG.find((p) => p.id === pluginId);
    if (!plugin) throw new Error('Plugin não encontrado');
    if (plugin.comingSoon) throw new Error('Este plugin estará disponível em breve');

    const connections = getConnectionsSync().filter((c) => c.pluginId !== pluginId);
    const connection: PluginConnection = {
      pluginId,
      status: 'connected',
      connectedAt: new Date().toISOString(),
      lastSyncAt: new Date().toISOString(),
      accountLabel: opts?.accountLabel ?? `${plugin.name} · conectado`,
      config: opts?.config ?? {},
    };
    const next = [...connections, connection];
    localStore.set(KEY, next);
    if (useCloudData()) {
      void setDocument('plugins', pluginId, connection);
    }
    return connection;
  },

  disconnect(pluginId: string): void {
    let next = getConnectionsSync().filter((c) => c.pluginId !== pluginId);
    if (pluginId === 'google-workspace') {
      next = next.filter(
        (c) => c.pluginId !== 'gmail' && c.pluginId !== 'google-calendar'
      );
    }
    localStore.set(KEY, next);
    if (useCloudData()) {
      void removeDocument('plugins', pluginId);
      if (pluginId === 'google-workspace') {
        void removeDocument('plugins', 'gmail');
        void removeDocument('plugins', 'google-calendar');
      }
    }
  },

  async disconnectAsync(pluginId: string): Promise<void> {
    this.disconnect(pluginId);
  },

  sync(pluginId: string): PluginConnection {
    const connections = getConnectionsSync();
    const idx = connections.findIndex((c) => c.pluginId === pluginId);
    if (idx < 0) throw new Error('Plugin não conectado');
    connections[idx] = {
      ...connections[idx],
      lastSyncAt: new Date().toISOString(),
      status: 'connected',
      error: undefined,
    };
    localStore.set(KEY, connections);
    if (useCloudData()) {
      void setDocument('plugins', pluginId, connections[idx]);
    }
    return connections[idx];
  },

  getAccessToken(pluginId: string): string | null {
    const c = getConnectionsSync().find(
      (x) => x.pluginId === pluginId && x.status === 'connected'
    );
    return c?.config?.accessToken || null;
  },

  /**
   * Live connector actions
   */
  async sendGmail(opts: {
    to: string;
    subject: string;
    body: string;
  }): Promise<void> {
    const token =
      this.getAccessToken('gmail') || this.getAccessToken('google-workspace');
    if (!token) throw new Error('Conecte o Google Workspace / Gmail primeiro.');

    const message = [
      `To: ${opts.to}`,
      `Subject: ${opts.subject}`,
      'Content-Type: text/plain; charset=utf-8',
      '',
      opts.body,
    ].join('\r\n');

    const encoded = btoa(unescape(encodeURIComponent(message)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const res = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ raw: encoded }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gmail API: ${res.status} ${err}`);
    }
  },

  async createCalendarEvent(opts: {
    summary: string;
    description?: string;
    startIso: string;
    endIso: string;
  }): Promise<void> {
    const token =
      this.getAccessToken('google-calendar') ||
      this.getAccessToken('google-workspace');
    if (!token) throw new Error('Conecte o Google Calendar primeiro.');

    const res = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: opts.summary,
          description: opts.description,
          start: { dateTime: opts.startIso },
          end: { dateTime: opts.endIso },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Calendar API: ${res.status} ${err}`);
    }
  },

  async listGithubRepos(): Promise<{ name: string; html_url: string }[]> {
    const token = this.getAccessToken('github');
    if (!token) throw new Error('Conecte o GitHub primeiro.');
    const res = await fetch('https://api.github.com/user/repos?per_page=20&sort=updated', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
    });
    if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
    const data = (await res.json()) as { name: string; html_url: string }[];
    return data.map((r) => ({ name: r.name, html_url: r.html_url }));
  },

  async createStripePaymentLink(opts: {
    title: string;
    amountCents: number;
    currency?: string;
  }): Promise<string> {
    const secret = this.getAccessToken('stripe');
    if (!secret) throw new Error('Conecte o Stripe primeiro.');

    const params = new URLSearchParams();
    params.set('line_items[0][price_data][currency]', opts.currency || 'brl');
    params.set('line_items[0][price_data][product_data][name]', opts.title);
    params.set('line_items[0][price_data][unit_amount]', String(opts.amountCents));
    params.set('line_items[0][quantity]', '1');
    params.set('after_completion[type]', 'redirect');
    params.set(
      'after_completion[redirect][url]',
      `${window.location.origin}/app/proposals`
    );

    const res = await fetch('https://api.stripe.com/v1/payment_links', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Stripe API: ${res.status} ${err}`);
    }
    const data = (await res.json()) as { url: string };
    return data.url;
  },

  async postSlackMessage(text: string): Promise<void> {
    const webhook = this.getAccessToken('slack');
    if (!webhook) throw new Error('Conecte o Slack primeiro.');
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error(`Slack webhook: ${res.status}`);
  },

  async createNotionPage(opts: { title: string; content?: string }): Promise<void> {
    const token = this.getAccessToken('notion');
    if (!token) throw new Error('Conecte o Notion primeiro.');
    // Notion requires parent page_id — store as config or fail with guidance
    const parentId = getConnectionsSync().find((c) => c.pluginId === 'notion')?.config
      ?.parentPageId;
    if (!parentId) {
      throw new Error(
        'Configure parentPageId no connector Notion (ID da página pai) ou use o export manual.'
      );
    }
    const res = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        parent: { page_id: parentId },
        properties: {
          title: { title: [{ text: { content: opts.title } }] },
        },
        children: opts.content
          ? [
              {
                object: 'block',
                type: 'paragraph',
                paragraph: {
                  rich_text: [{ type: 'text', text: { content: opts.content.slice(0, 2000) } }],
                },
              },
            ]
          : [],
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Notion API: ${res.status} ${err}`);
    }
  },

  /** Verify a connector still works (quick live check) */
  async testConnection(pluginId: string): Promise<string> {
    if (pluginId === 'github') {
      const repos = await this.listGithubRepos();
      return `${repos.length} repositórios acessíveis`;
    }
    if (pluginId === 'google-workspace' || pluginId === 'gmail') {
      const token =
        this.getAccessToken('gmail') || this.getAccessToken('google-workspace');
      if (!token) throw new Error('Sem token Google');
      const res = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Google token inválido (${res.status})`);
      const data = (await res.json()) as { email?: string };
      return data.email ? `OK · ${data.email}` : 'OK · token válido';
    }
    if (pluginId === 'stripe') {
      const secret = this.getAccessToken('stripe');
      if (!secret) throw new Error('Sem chave Stripe');
      const res = await fetch('https://api.stripe.com/v1/balance', {
        headers: { Authorization: `Bearer ${secret}` },
      });
      if (!res.ok) throw new Error(`Stripe: ${res.status}`);
      return 'Stripe balance OK';
    }
    if (pluginId === 'slack') {
      await this.postSlackMessage('✅ Aurea · teste de conexão Slack');
      return 'Mensagem de teste enviada';
    }
    this.sync(pluginId);
    return 'Marcação de sync atualizada';
  },
};
