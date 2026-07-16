import { localStore } from '@/core/storage/local-storage';
import { generateId } from '@/shared/utils/utils';
import type { Client, ClientStatus } from '@/types/domain';
import { useCloudData } from '@/core/db/mode';
import {
  listCollection,
  getDocument,
  setDocument,
  removeDocument,
} from '@/core/firebase/user-repo';

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
    notes: 'Cliente recorrente.',
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
    status: 'lead',
    notes: 'Lead quente via indicação.',
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

function ensureSeed(): Client[] {
  const existing = localStore.get<Client[] | null>(KEY, null);
  if (existing && existing.length > 0) return existing;
  // Only seed local demo mode — cloud starts empty (real data)
  if (!useCloudData()) {
    localStore.set(KEY, seedClients);
    return seedClients;
  }
  return [];
}

function paginate(
  items: Client[],
  filters: ClientFilters
): PaginatedResult<Client> {
  let list = [...items];
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
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q) ||
        c.document?.includes(q)
    );
  }
  if (status !== 'all') list = list.filter((c) => c.status === status);

  list.sort((a, b) => {
    const av = a[sortBy] ?? '';
    const bv = b[sortBy] ?? '';
    const cmp = String(av).localeCompare(String(bv), 'pt-BR', { sensitivity: 'base' });
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  return {
    data: list.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    totalPages,
  };
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

async function loadAll(): Promise<Client[]> {
  if (useCloudData()) {
    const items = await listCollection<Client>('clients');
    localStore.set(KEY, items);
    return items;
  }
  return ensureSeed();
}

export const clientsService = {
  list(filters: ClientFilters = {}): PaginatedResult<Client> {
    return paginate(ensureSeed(), filters);
  },

  async listAsync(filters: ClientFilters = {}): Promise<PaginatedResult<Client>> {
    const items = await loadAll();
    return paginate(items, filters);
  },

  getAll(): Client[] {
    return ensureSeed();
  },

  async getAllAsync(): Promise<Client[]> {
    return loadAll();
  },

  getById(id: string): Client | undefined {
    return ensureSeed().find((c) => c.id === id);
  },

  async getByIdAsync(id: string): Promise<Client | undefined> {
    if (useCloudData()) {
      return getDocument<Client>('clients', id);
    }
    return this.getById(id);
  },

  create(input: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Client {
    const now = new Date().toISOString();
    const client: Client = {
      ...input,
      id: generateId('cli'),
      createdAt: now,
      updatedAt: now,
    };
    localStore.set(KEY, [client, ...ensureSeed()]);
    return client;
  },

  async createAsync(
    input: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Client> {
    const client = this.create(input);
    if (useCloudData()) {
      await setDocument('clients', client.id, client);
    }
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

  async updateAsync(id: string, patch: Partial<Client>): Promise<Client | undefined> {
    const updated = this.update(id, patch);
    if (updated && useCloudData()) {
      await setDocument('clients', id, updated);
    }
    return updated;
  },

  remove(id: string): boolean {
    const all = ensureSeed();
    const next = all.filter((c) => c.id !== id);
    if (next.length === all.length) return false;
    localStore.set(KEY, next);
    return true;
  },

  async removeAsync(id: string): Promise<boolean> {
    const ok = this.remove(id);
    if (ok && useCloudData()) {
      await removeDocument('clients', id);
    }
    return ok;
  },
};
