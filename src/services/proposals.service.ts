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
