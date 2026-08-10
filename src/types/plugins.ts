export type PluginCategory =
  | 'communication'
  | 'payments'
  | 'productivity'
  | 'calendar'
  | 'storage'
  | 'crm'
  | 'comms'
  | 'dev'
  | 'other'
  | 'auth';

export type PluginStatus = 'available' | 'connected' | 'error' | 'coming_soon';

export interface PluginDefinition {
  id: string;
  name: string;
  description: string;
  category: PluginCategory;
  icon: string;
  website?: string;
  docsUrl?: string;
  oauthReady?: boolean;
  oauth?: boolean;
  comingSoon?: boolean;
}

export interface PluginConnection {
  pluginId: string;
  status: PluginStatus;
  connected?: boolean;
  connectedAt?: string;
  accountLabel?: string;
  accessToken?: string;
  config?: Record<string, string>;
  lastSyncAt?: string | null;
  error?: string;
}

export interface PluginRuntime extends PluginDefinition {
  connection?: PluginConnection;
}
