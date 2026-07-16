export const APP_CONFIG = {
  name: 'Aurea',
  legalName: 'Aurea Technologies',
  tagline: 'Plataforma comercial para profissionais independentes',
  version: '4.1.0',
  description:
    'Aurea é a plataforma empresarial para precificação de projetos, gestão de propostas e operação do pipeline comercial de freelancers e consultores.',
  supportEmail: 'enterprise@aurea.app',
  defaultCurrency: 'BRL' as const,
  defaultHourlyRate: 120,
  storagePrefix: 'aurea_v1',
  brand: {
    primary: '#4F46E5',
    gold: '#C5A04A',
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
    contractDetail: (id: string) => `/app/contracts/${id}`,
    analytics: '/app/analytics',
    integrations: '/app/integrations',
    settings: '/app/settings',
    profile: '/app/profile',
  },
  designSystem: '/design-system',
} as const;
