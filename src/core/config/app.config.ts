/**
 * Brand images: Unsplash License (https://unsplash.com/license)
 */
export const APP_CONFIG = {
  name: 'Áurea',
  legalName: 'Áurea',
  tagline: 'Do escopo ao contrato, com preço e processo claros',
  version: '4.2.0',
  description:
    'Áurea é o workspace comercial para freelancers, consultores e pequenas agências que precisam precificar projetos, organizar clientes, enviar propostas e acompanhar contratos sem depender de planilhas.',
  supportEmail: 'contato@thomaseduardo.com.br',
  defaultCurrency: 'BRL' as const,
  defaultHourlyRate: 120,
  storagePrefix: 'aurea_v1',
  brand: {
    primary: '#F26522',
    gold: '#F26522',
    ink: '#171614',
    paper: '#F4F1EB',
    logo: '/logo.png',
    logoMark: '/logo.png',
    favicon: '/favicon.png',
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
    settings: '/app/settings',
    profile: '/app/profile',
  },
  designSystem: '/design-system',
} as const;
