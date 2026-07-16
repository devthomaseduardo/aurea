import { localStore } from '@/core/storage/local-storage';
import { generateId } from '@/shared/utils/utils';
import type { Contract, ContractStatus } from '@/types/domain';
import { useCloudData } from '@/core/db/mode';
import {
  listCollection,
  getDocument,
  setDocument,
  removeDocument,
} from '@/core/firebase/user-repo';

const KEY = 'contracts';

const seed: Contract[] = [
  {
    id: 'ctr_seed_1',
    proposalId: 'prop_seed_3',
    title: 'Site Institucional',
    clientId: 'cli_seed_3',
    clientName: 'Agência Digital',
    status: 'active',
    currency: 'BRL',
    totalValue: 12800,
    startDate: new Date(Date.now() - 86400000 * 14).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 16).toISOString(),
    content: 'Contrato de prestação de serviços — Site Institucional',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 'ctr_seed_2',
    title: 'Manutenção Mensal — TechCorp',
    clientId: 'cli_seed_1',
    clientName: 'TechCorp Brasil',
    status: 'pending_signature',
    currency: 'BRL',
    totalValue: 3500,
    content: 'Contrato de manutenção mensal',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

function ensureSeed(): Contract[] {
  const existing = localStore.get<Contract[] | null>(KEY, null);
  if (existing && existing.length > 0) return existing;
  if (!useCloudData()) {
    localStore.set(KEY, seed);
    return seed;
  }
  return [];
}

function paginate(
  items: Contract[],
  filters: {
    search?: string;
    status?: ContractStatus | 'all';
    page?: number;
    pageSize?: number;
  }
) {
  let list = [...items];
  const { search = '', status = 'all', page = 1, pageSize = 10 } = filters;

  if (search.trim()) {
    const q = search.toLowerCase();
    list = list.filter(
      (c) =>
        c.title.toLowerCase().includes(q) || c.clientName.toLowerCase().includes(q)
    );
  }
  if (status !== 'all') list = list.filter((c) => c.status === status);

  list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

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

async function loadAll(): Promise<Contract[]> {
  if (useCloudData()) {
    const items = await listCollection<Contract>('contracts');
    localStore.set(KEY, items);
    return items;
  }
  return ensureSeed();
}

export const contractsService = {
  list(
    filters: {
      search?: string;
      status?: ContractStatus | 'all';
      page?: number;
      pageSize?: number;
    } = {}
  ) {
    return paginate(ensureSeed(), filters);
  },

  async listAsync(
    filters: {
      search?: string;
      status?: ContractStatus | 'all';
      page?: number;
      pageSize?: number;
    } = {}
  ) {
    return paginate(await loadAll(), filters);
  },

  getAll(): Contract[] {
    return ensureSeed();
  },

  async getAllAsync(): Promise<Contract[]> {
    return loadAll();
  },

  getById(id: string): Contract | undefined {
    return ensureSeed().find((c) => c.id === id);
  },

  async getByIdAsync(id: string): Promise<Contract | undefined> {
    if (useCloudData()) {
      return getDocument<Contract>('contracts', id);
    }
    return this.getById(id);
  },

  create(input: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>): Contract {
    const now = new Date().toISOString();
    const contract: Contract = {
      ...input,
      id: generateId('ctr'),
      createdAt: now,
      updatedAt: now,
    };
    localStore.set(KEY, [contract, ...ensureSeed()]);
    return contract;
  },

  async createAsync(
    input: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Contract> {
    const contract = this.create(input);
    if (useCloudData()) {
      await setDocument('contracts', contract.id, contract);
    }
    return contract;
  },

  update(id: string, patch: Partial<Contract>): Contract | undefined {
    const all = ensureSeed();
    const idx = all.findIndex((c) => c.id === id);
    if (idx < 0) return undefined;
    all[idx] = { ...all[idx], ...patch, id, updatedAt: new Date().toISOString() };
    localStore.set(KEY, all);
    return all[idx];
  },

  async updateAsync(id: string, patch: Partial<Contract>): Promise<Contract | undefined> {
    const updated = this.update(id, patch);
    if (updated && useCloudData()) {
      await setDocument('contracts', id, updated);
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
      await removeDocument('contracts', id);
    }
    return ok;
  },
};
