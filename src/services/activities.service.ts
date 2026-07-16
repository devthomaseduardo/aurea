import { localStore } from '@/core/storage/local-storage';
import { generateId } from '@/shared/utils/utils';
import type { Activity } from '@/types/domain';
import { useCloudData } from '@/core/db/mode';
import {
  listCollection,
  setDocument,
} from '@/core/firebase/user-repo';

const KEY = 'activities';

function localList(): Activity[] {
  return localStore.get<Activity[]>(KEY, []);
}

export const activitiesService = {
  list(limit = 10): Activity[] {
    return [...localList()]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  },

  add(input: Omit<Activity, 'id' | 'createdAt'>): Activity {
    const activity: Activity = {
      ...input,
      id: generateId('act'),
      createdAt: new Date().toISOString(),
    };
    localStore.set(KEY, [activity, ...localList()]);
    return activity;
  },

  async listAsync(limit = 10): Promise<Activity[]> {
    if (useCloudData()) {
      const items = await listCollection<Activity>('activities', 'createdAt');
      localStore.set(KEY, items);
      return items.slice(0, limit);
    }
    return this.list(limit);
  },

  async addAsync(input: Omit<Activity, 'id' | 'createdAt'>): Promise<Activity> {
    const activity: Activity = {
      ...input,
      id: generateId('act'),
      createdAt: new Date().toISOString(),
    };
    if (useCloudData()) {
      await setDocument('activities', activity.id, activity);
    }
    localStore.set(KEY, [activity, ...localList()]);
    return activity;
  },
};
