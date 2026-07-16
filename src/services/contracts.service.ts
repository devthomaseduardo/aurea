import { localStore } from '@/core/storage/local-storage';
import { generateId } from '@/shared/utils/utils';
import type { Contract, ContractStatus } from '@/types/domain';

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
  localStore.set(KEY, seed);
  return seed;
}

export const contractsService = {
  list(filters: {
    search?: string;
    status?: ContractStatus | 'all';
    page?: number;
    pageSize?: number;
  } = {}) {
    let items = [...ensureSeed()];
    const { search = '', status = 'all', page = 1, pageSize = 10 } = filters;

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (c) =>
          c.title.toLowerCase().includes(q) || c.clientName.toLowerCase().includes(q)
      );
    }
    if (status !== 'all') items = items.filter((c) => c.status === status);

    items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;

    return {
      data: items.slice(start, start + pageSize),
      total,
      page,
      pageSize,
      totalPages,
    };
  },

  getAll(): Contract[] {
    return ensureSeed();
  },

  getById(id: string): Contract | undefined {
    return ensureSeed().find((c) => c.id === id);
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

  update(id: string, patch: Partial<Contract>): Contract | undefined {
    const all = ensureSeed();
    const idx = all.findIndex((c) => c.id === id);
    if (idx < 0) return undefined;
    all[idx] = { ...all[idx], ...patch, id, updatedAt: new Date().toISOString() };
    localStore.set(KEY, all);
    return all[idx];
  },

  remove(id: string): boolean {
    const all = ensureSeed();
    const next = all.filter((c) => c.id !== id);
    if (next.length === all.length) return false;
    localStore.set(KEY, next);
    return true;
  },
};
