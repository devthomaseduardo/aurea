import { localStore } from '@/core/storage/local-storage';
import { generateId } from '@/shared/utils/utils';
import type { Proposal, ProposalStatus } from '@/types/domain';
import type { DadosProjeto, ResultadoOrcamento } from '@/modules/calculator/domain/calculadora';
import { isCloudDataEnabled } from '@/core/db/mode';
import {
  listCollection,
  getDocument,
  setDocument,
  removeDocument,
} from '@/core/firebase/user-repo';

const KEY = 'proposals';

const seed: Proposal[] = [
  {
    id: 'prop_seed_1',
    title: 'Landing Page + Dashboard SaaS',
    clientId: 'cli_seed_1',
    clientName: 'TechCorp Brasil',
    status: 'sent',
    currency: 'BRL',
    totalValue: 28400,
    totalHours: 152,
    totalDays: 19,
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    model: 'padrao',
    projectSnapshot: null,
    resultSnapshot: null,
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    sentAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'prop_seed_2',
    title: 'App Mobile E-commerce',
    clientId: 'cli_seed_2',
    clientName: 'Startup.io',
    status: 'draft',
    currency: 'BRL',
    totalValue: 45200,
    totalHours: 240,
    totalDays: 30,
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    model: 'premium',
    projectSnapshot: null,
    resultSnapshot: null,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'prop_seed_3',
    title: 'Site Institucional',
    clientId: 'cli_seed_3',
    clientName: 'Agência Digital',
    status: 'accepted',
    currency: 'BRL',
    totalValue: 12800,
    totalHours: 80,
    totalDays: 10,
    technologies: ['Next.js', 'Tailwind CSS'],
    model: 'basico',
    projectSnapshot: null,
    resultSnapshot: null,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    sentAt: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
];

function ensureSeed(): Proposal[] {
  const existing = localStore.get<Proposal[] | null>(KEY, null);
  if (existing && existing.length > 0) return existing;
  // Cloud starts empty; local demo seeds sample proposals
  if (!isCloudDataEnabled()) {
    localStore.set(KEY, seed);
    return seed;
  }
  return [];
}

function paginate(items: Proposal[], filters: ProposalFilters) {
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
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.clientName.toLowerCase().includes(q) ||
        p.technologies.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (status !== 'all') {
    list = list.filter((p) => p.status === status);
  }

  list.sort((a, b) => {
    const av = a[sortBy as keyof Proposal];
    const bv = b[sortBy as keyof Proposal];
    if (av === bv) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    const cmp = av < bv ? -1 : 1;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const total = list.length;
  const start = (page - 1) * pageSize;
  const itemsPage = list.slice(start, start + pageSize);
  return { items: itemsPage, total, page, pageSize };
}

export type ProposalFilters = {
  search?: string;
  status?: ProposalStatus | 'all';
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
};

export const proposalsService = {
  async list(filters: ProposalFilters = {}) {
    if (isCloudDataEnabled()) {
      const all = await listCollection<Proposal>('proposals');
      return paginate(all, filters);
    }
    const all = ensureSeed();
    return paginate(all, filters);
  },

  getAll(): Proposal[] {
    return ensureSeed();
  },

  getById(id: string): Proposal | undefined {
    return ensureSeed().find((p) => p.id === id);
  },

  async getByIdAsync(id: string): Promise<Proposal | undefined> {
    if (isCloudDataEnabled()) {
      return getDocument<Proposal>('proposals', id);
    }
    return this.getById(id);
  },

  createFromCalculation(
    title: string,
    clientId: string,
    clientName: string,
    project: DadosProjeto,
    result: ResultadoOrcamento,
    model: string
  ): Proposal {
    const all = ensureSeed();
    const proposal: Proposal = {
      id: generateId(),
      title,
      clientId,
      clientName,
      status: 'draft',
      currency: 'BRL',
      totalValue: result.total,
      totalHours: result.horas,
      totalDays: result.dias,
      technologies: project.tecnologias || [],
      model,
      projectSnapshot: project,
      resultSnapshot: result,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    all.unshift(proposal);
    localStore.set(KEY, all);
    if (isCloudDataEnabled()) {
      void setDocument('proposals', proposal.id, proposal);
    }
    return proposal;
  },

  updateStatus(id: string, status: ProposalStatus): Proposal | undefined {
    const all = ensureSeed();
    const idx = all.findIndex((p) => p.id === id);
    if (idx < 0) return undefined;
    const updated = {
      ...all[idx],
      status,
      updatedAt: new Date().toISOString(),
      ...(status === 'sent' ? { sentAt: new Date().toISOString() } : {}),
    };
    all[idx] = updated;
    localStore.set(KEY, all);
    if (updated && isCloudDataEnabled()) {
      void setDocument('proposals', id, updated);
    }
    return updated;
  },

  duplicate(id: string): Proposal | undefined {
    const original = this.getById(id);
    if (!original) return undefined;
    const all = ensureSeed();
    const copy: Proposal = {
      ...original,
      id: generateId(),
      title: `${original.title} (cópia)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sentAt: undefined,
    };
    all.unshift(copy);
    localStore.set(KEY, all);
    if (isCloudDataEnabled()) {
      void setDocument('proposals', copy.id, copy);
    }
    return copy;
  },

  remove(id: string): boolean {
    const all = ensureSeed();
    const next = all.filter((p) => p.id !== id);
    if (next.length === all.length) return false;
    localStore.set(KEY, next);
    return true;
  },

  async removeAsync(id: string): Promise<boolean> {
    const ok = this.remove(id);
    if (ok && isCloudDataEnabled()) {
      await removeDocument('proposals', id);
    }
    return ok;
  },
};
