import { localStore } from '@/core/storage/local-storage';
import type { UserProfile } from '@/types/domain';

const KEY = 'profile';

const defaultProfile: UserProfile = {
  name: 'Thomas Eduardo',
  email: 'developer.thomas@outlook.com.br',
  document: '000.000.000-00',
  address: 'Rua do Freelancer, 42 — São Paulo, SP',
  phone: '+55 11 99999-0000',
  hourlyRate: 120,
  currency: 'BRL',
  taxRegime: 'mei',
  companyName: 'Thomas Eduardo Dev',
  bio: 'Desenvolvedor full-stack especializado em produtos SaaS e experiências digitais premium.',
};

export const profileService = {
  get(): UserProfile {
    return localStore.get<UserProfile>(KEY, defaultProfile);
  },

  update(patch: Partial<UserProfile>): UserProfile {
    const next = { ...this.get(), ...patch };
    localStore.set(KEY, next);
    return next;
  },
};
