import { localStore } from '@/core/storage/local-storage';
import { generateId } from '@/shared/utils/utils';
import type { Activity } from '@/types/domain';

const KEY = 'activities';

const seed: Activity[] = [
  {
    id: 'act_1',
    type: 'proposal',
    title: 'Proposta enviada',
    description: 'Landing Page + Dashboard SaaS → TechCorp Brasil',
    entityId: 'prop_seed_1',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'act_2',
    type: 'client',
    title: 'Novo lead capturado',
    description: 'Bruno Lima — Startup.io',
    entityId: 'cli_seed_2',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'act_3',
    type: 'contract',
    title: 'Contrato assinado',
    description: 'Site Institucional — Agência Digital',
    entityId: 'ctr_seed_1',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
  {
    id: 'act_4',
    type: 'calculation',
    title: 'Orçamento calculado',
    description: 'App Mobile E-commerce — R$ 45.200',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'act_5',
    type: 'proposal',
    title: 'Proposta aceita',
    description: 'Site Institucional — Agência Digital',
    entityId: 'prop_seed_3',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
];

function ensureSeed(): Activity[] {
  const existing = localStore.get<Activity[] | null>(KEY, null);
  if (existing && existing.length > 0) return existing;
  localStore.set(KEY, seed);
  return seed;
}

export const activitiesService = {
  list(limit = 10): Activity[] {
    return [...ensureSeed()]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  },

  add(input: Omit<Activity, 'id' | 'createdAt'>): Activity {
    const activity: Activity = {
      ...input,
      id: generateId('act'),
      createdAt: new Date().toISOString(),
    };
    localStore.set(KEY, [activity, ...ensureSeed()]);
    return activity;
  },
};
