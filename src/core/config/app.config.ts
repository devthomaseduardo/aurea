/**
 * Brand images: Unsplash License (https://unsplash.com/license)
 * - Hero workspace: photo-1497366216548-37526070297c
 * - Product/desk:   photo-1460925895917-afdab827c52f
 * - Team:           photo-1553877522-43269d4ea984
 * - Analytics:      photo-1551288049-bebda4e38f71
 */
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
    primary: '#4F46E5',
    gold: '#D4A017',
    ink: '#0F172A',
    paper: '#F8FAFC',
    // Mark is CSS/text-based in BrandLogo - no local bitmap required
    logo: '',
    logoMark: '',
    hero:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80',
    product:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    team:
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80',
    analytics:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    pattern: '',
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
    orders: '/app/orders',
    ordersNew: '/app/orders/new',
    orderDetail: (id: string) => `/app/orders/${id}`,
    pos: '/app/pos',
    inventory: '/app/inventory',
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
