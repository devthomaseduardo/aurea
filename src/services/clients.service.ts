import { localStore } from '@/core/storage/local-storage';
import { generateId } from '@/shared/utils/utils';
import type { Client, ClientStatus } from '@/types/domain';

const KEY = 'clients';

const seedClients: Client[] = [
  {
    id: 'cli_seed_1',
    name: 'Ana Souza',
    email: 'ana@techcorp.com.br',
    phone: '+55 11 98888-1001',
    company: 'TechCorp Brasil',
    document: '12.345.678/0001-99',
    address: 'Av. Paulista, 1000 — São Paulo, SP',
    notes: 'Cliente recorrente. Prefere propostas detalhadas.',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'cli_seed_2',
    name: 'Bruno Lima',
    email: 'bruno@startup.io',
    phone: '+55 21 97777-2002',
    company: 'Startup.io',
    document: '98.765.432/0001-10',
    status: 'lead',
    notes: 'Lead quente via indicação.',
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'cli_seed_3',
    name: 'Carla Mendes',
    email: 'carla@agencia.digital',
    company: 'Agência Digital',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    id: 'cli_seed_4',
    name: 'Diego Rocha',
    email: 'diego@ecommerce.br',
    company: 'E-Commerce BR',
    status: 'inactive',
    createdAt: new Date(Date.now() - 86400000 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 60).toISOString(),
  },
];

function ensureSeed(): Client[] {
  const existing = localStore.get<Client[] | null>(KEY, null);
  if (existing && existing.length > 0) return existing;
  localStore.set(KEY, seedClients);
  return seedClients;
}

export interface ClientFilters {
  search?: string;
  status?: ClientStatus | 'all';
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortDir?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const clientsService = {
  list(filters: ClientFilters = {}): PaginatedResult<Client> {
    let items = [...ensureSeed()];
    const {
      search = '',
      status = 'all',
      sortBy = 'updatedAt',
      sortDir = 'desc',
      page = 1,
      pageSize = 10,
    } = filters;

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.company?.toLowerCase().includes(q) ||
          c.document?.includes(q)
      );
    }

    if (status !== 'all') {
      items = items.filter((c) => c.status === status);
    }

    items.sort((a, b) => {
      const av = a[sortBy] ?? '';
      const bv = b[sortBy] ?? '';
      const cmp = String(av).localeCompare(String(bv), 'pt-BR', { sensitivity: 'base' });
      return sortDir === 'asc' ? cmp : -cmp;
    });

    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const data = items.slice(start, start + pageSize);

    return { data, total, page, pageSize, totalPages };
  },

  getAll(): Client[] {
    return ensureSeed();
  },

  getById(id: string): Client | undefined {
    return ensureSeed().find((c) => c.id === id);
  },

  create(input: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Client {
    const now = new Date().toISOString();
    const client: Client = {
      ...input,
      id: generateId('cli'),
      createdAt: now,
      updatedAt: now,
    };
    const all = ensureSeed();
    localStore.set(KEY, [client, ...all]);
    return client;
  },

  update(id: string, patch: Partial<Client>): Client | undefined {
    const all = ensureSeed();
    const idx = all.findIndex((c) => c.id === id);
    if (idx < 0) return undefined;
    const updated: Client = {
      ...all[idx],
      ...patch,
      id,
      updatedAt: new Date().toISOString(),
    };
    all[idx] = updated;
    localStore.set(KEY, all);
    return updated;
  },

  remove(id: string): boolean {
    const all = ensureSeed();
    const next = all.filter((c) => c.id !== id);
    if (next.length === all.length) return false;
    localStore.set(KEY, next);
    return true;
  },
};
