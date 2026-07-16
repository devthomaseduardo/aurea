export type PluginCategory =
  | 'communication'
  | 'payments'
  | 'productivity'
  | 'calendar'
  | 'storage'
  | 'crm';

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
  comingSoon?: boolean;
}

export interface PluginConnection {
  pluginId: string;
  status: PluginStatus;
  connectedAt?: string;
  accountLabel?: string;
  config?: Record<string, string>;
  lastSyncAt?: string;
  error?: string;
}

export interface PluginRuntime extends PluginDefinition {
  connection?: PluginConnection;
}
