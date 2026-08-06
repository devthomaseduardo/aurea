import type { TenantCompany } from '@/types/domain';

const DEFAULT_TENANTS: TenantCompany[] = [
  {
    id: 'cambuci-mobile',
    name: 'Cambuci Mobile',
    legalName: 'Cambuci Mobile LTDA',
    slug: 'cambuci-mobile',
    logoUrl: '/brand/logo.png',
    primaryColor: '#1D4ED8',
    accentColor: '#EAB308',
    phone: '(11) 3208-4500',
    whatsapp: '5511987654321',
    address: 'Av. Lins de Vasconcelos, 1200 - Cambuci, São Paulo - SP',
    cnpj: '42.189.902/0001-88',
    warrantyDays: 90,
    warrantyTerms:
      'Garantia legal de 90 dias referente às peças trocadas e serviços executados. Não cobre danos líquidos ou quedas após a entrega.',
  },
  {
    id: 'techfix-sp',
    name: 'TechFix SP Balcão',
    legalName: 'TechFix Serviços Celulares LTDA',
    slug: 'techfix-sp',
    logoUrl: '/brand/logo.png',
    primaryColor: '#2563EB',
    accentColor: '#10B981',
    phone: '(11) 3344-9988',
    whatsapp: '5511998877665',
    address: 'Rua Augusta, 500 - Consolação, São Paulo - SP',
    cnpj: '38.452.110/0001-90',
    warrantyDays: 90,
    warrantyTerms: 'Garantia de 90 dias com vistoria e laudo prévio.',
  },
];

const STORAGE_ACTIVE_TENANT = 'cambuci_active_tenant_v1';
const STORAGE_TENANTS = 'cambuci_tenants_list_v1';

class SettingsService {
  getTenants(): TenantCompany[] {
    try {
      const stored = localStorage.getItem(STORAGE_TENANTS);
      if (!stored) {
        localStorage.setItem(STORAGE_TENANTS, JSON.stringify(DEFAULT_TENANTS));
        return DEFAULT_TENANTS;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_TENANTS;
    }
  }

  getActiveTenant(): TenantCompany {
    try {
      const activeId = localStorage.getItem(STORAGE_ACTIVE_TENANT) || 'cambuci-mobile';
      const tenants = this.getTenants();
      return tenants.find((t) => t.id === activeId) || tenants[0];
    } catch {
      return DEFAULT_TENANTS[0];
    }
  }

  setActiveTenant(id: string): TenantCompany {
    localStorage.setItem(STORAGE_ACTIVE_TENANT, id);
    return this.getActiveTenant();
  }

  updateTenant(id: string, updates: Partial<TenantCompany>): TenantCompany {
    const tenants = this.getTenants();
    const index = tenants.findIndex((t) => t.id === id);
    if (index === -1) return DEFAULT_TENANTS[0];

    tenants[index] = { ...tenants[index], ...updates };
    localStorage.setItem(STORAGE_TENANTS, JSON.stringify(tenants));
    return tenants[index];
  }
}

export const settingsService = new SettingsService();
