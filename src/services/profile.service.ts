import { localStore } from '@/core/storage/local-storage';
import type { UserProfile } from '@/types/domain';
import { useCloudData } from '@/core/db/mode';
import {
  getUserProfileData,
  setUserProfileData,
} from '@/core/firebase/user-repo';

const KEY = 'profile';

const defaultProfile: UserProfile = {
  name: '',
  email: '',
  document: '',
  address: '',
  phone: '',
  hourlyRate: 120,
  currency: 'BRL',
  taxRegime: 'mei',
  companyName: '',
  bio: '',
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

  async getAsync(): Promise<UserProfile> {
    if (useCloudData()) {
      const cloud = await getUserProfileData<UserProfile>();
      if (cloud) {
        localStore.set(KEY, cloud);
        return cloud;
      }
      return defaultProfile;
    }
    return this.get();
  },

  async updateAsync(patch: Partial<UserProfile>): Promise<UserProfile> {
    const current = await this.getAsync();
    const next = { ...current, ...patch };
    if (useCloudData()) {
      await setUserProfileData(next);
    }
    localStore.set(KEY, next);
    return next;
  },
};
