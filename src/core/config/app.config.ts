export const APP_CONFIG = {
  name: 'CalculaFreela',
  tagline: 'Orçamentos que vencem contratos',
  version: '2.0.0',
  description:
    'Plataforma profissional para freelancers calcularem orçamentos, gerarem propostas e gerenciarem clientes.',
  supportEmail: 'suporte@calculafreela.app',
  defaultCurrency: 'BRL' as const,
  defaultHourlyRate: 120,
  storagePrefix: 'cf_v2',
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 25, 50],
  },
} as const;

export const ROUTES = {
  home: '/',
  app: {
    root: '/app',
    dashboard: '/app/dashboard',
    clients: '/app/clients',
    clientsNew: '/app/clients/new',
    clientDetail: (id: string) => `/app/clients/${id}`,
    calculator: '/app/calculator',
    proposals: '/app/proposals',
    proposalDetail: (id: string) => `/app/proposals/${id}`,
    contracts: '/app/contracts',
    contractDetail: (id: string) => `/app/contracts/${id}`,
    analytics: '/app/analytics',
    settings: '/app/settings',
    profile: '/app/profile',
  },
  designSystem: '/design-system',
} as const;
