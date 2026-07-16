import { localStore } from '@/core/storage/local-storage';
import { generateId } from '@/shared/utils/utils';
import type { Proposal, ProposalStatus } from '@/types/domain';
import type { DadosProjeto, ResultadoOrcamento } from '@/modules/calculator/domain/calculadora';

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
  localStore.set(KEY, seed);
  return seed;
}

export interface ProposalFilters {
  search?: string;
  status?: ProposalStatus | 'all';
  sortBy?: 'title' | 'totalValue' | 'createdAt' | 'updatedAt';
  sortDir?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export const proposalsService = {
  list(filters: ProposalFilters = {}) {
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
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.clientName.toLowerCase().includes(q) ||
          p.technologies.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (status !== 'all') items = items.filter((p) => p.status === status);

    items.sort((a, b) => {
      const av = a[sortBy] ?? '';
      const bv = b[sortBy] ?? '';
      const cmp =
        typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv), 'pt-BR');
      return sortDir === 'asc' ? cmp : -cmp;
    });

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

  getAll(): Proposal[] {
    return ensureSeed();
  },

  getById(id: string): Proposal | undefined {
    return ensureSeed().find((p) => p.id === id);
  },

  createFromCalculation(
    projeto: DadosProjeto,
    resultado: ResultadoOrcamento,
    extras?: Partial<Pick<Proposal, 'clientId' | 'status' | 'notes'>>
  ): Proposal {
    const now = new Date().toISOString();
    const valor =
      resultado.valoresPropostas[projeto.modeloProposta] ?? resultado.custoTotal;

    const proposal: Proposal = {
      id: generateId('prop'),
      title: projeto.nome,
      clientId: extras?.clientId,
      clientName: projeto.contratante.nome || 'Cliente não informado',
      status: extras?.status ?? 'draft',
      currency: projeto.moeda,
      totalValue: valor,
      totalHours: resultado.totalHoras,
      totalDays: resultado.totalDias,
      technologies: projeto.tecnologias.filter((t) => t.selecionada).map((t) => t.nome),
      model: projeto.modeloProposta,
      projectSnapshot: projeto,
      resultSnapshot: resultado,
      notes: extras?.notes,
      createdAt: now,
      updatedAt: now,
    };

    const all = ensureSeed();
    localStore.set(KEY, [proposal, ...all]);
    return proposal;
  },

  update(id: string, patch: Partial<Proposal>): Proposal | undefined {
    const all = ensureSeed();
    const idx = all.findIndex((p) => p.id === id);
    if (idx < 0) return undefined;
    const updated: Proposal = {
      ...all[idx],
      ...patch,
      id,
      updatedAt: new Date().toISOString(),
    };
    all[idx] = updated;
    localStore.set(KEY, all);
    return updated;
  },

  duplicate(id: string): Proposal | undefined {
    const original = this.getById(id);
    if (!original) return undefined;
    const now = new Date().toISOString();
    const copy: Proposal = {
      ...original,
      id: generateId('prop'),
      title: `${original.title} (cópia)`,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      sentAt: undefined,
    };
    const all = ensureSeed();
    localStore.set(KEY, [copy, ...all]);
    return copy;
  },

  remove(id: string): boolean {
    const all = ensureSeed();
    const next = all.filter((p) => p.id !== id);
    if (next.length === all.length) return false;
    localStore.set(KEY, next);
    return true;
  },
};
