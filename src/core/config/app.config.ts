export const APP_CONFIG = {
  name: 'Áurea',
  legalName: 'Áurea',
  tagline: 'Precifique projetos, gere propostas e feche contratos com clareza',
  version: '4.1.0',
  description:
    'Áurea é a plataforma comercial B2B para freelancers, consultores e agências: precificação de projetos, propostas profissionais, gestão de clientes, contratos e analytics.',
  supportEmail: 'contato@thomaseduardo.com.br',
  defaultCurrency: 'BRL' as const,
  defaultHourlyRate: 120,
  storagePrefix: 'aurea_v1',
  brand: {
    primary: '#4F46E5', // índigo
    gold: '#D4A017',
    ink: '#0F172A',
    paper: '#F8FAFC',
    logo: '/brand/logo.png',
    logoMark: '/brand/logo-mark.jpg',
    hero: '/brand/hero.jpg',
    pattern: '/brand/pattern.jpg',
    product: '/brand/product.jpg',
  },
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 25, 50],
  },
} as const;

export const ROUTES = {
  home: '/',
  about: '/sobre',
  services: '/servicos',
  catalog: '/catalogo',
  auth: {
    login: '/login',
    register: '/register',
    callback: '/auth/callback',
  },
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
    analytics: '/app/analytics',
    integrations: '/app/integrations',
    team: '/app/team',
    settings: '/app/settings',
    profile: '/app/profile',
  },
  designSystem: '/design-system',
} as const;
