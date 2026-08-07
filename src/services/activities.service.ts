import { Activity } from '@/types/domain';
import { generateId } from '@/shared/utils/utils';
import { storage } from '@/core/storage/local-storage';
import { isCloudDataEnabled } from '@/core/db/mode';
import { getDb } from '@/core/firebase/app';
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirebaseAuth } from '@/core/firebase/app';

const KEY = 'aurea_activities';

function uid(): string {
  return getFirebaseAuth()?.currentUser?.uid ?? 'anon';
}

export const activitiesService = {
  list(max = 20): Activity[] {
    const all = storage.getJSON<Activity[]>(KEY, []);
    return all.slice(0, max);
  },

  async listAsync(max = 20): Promise<Activity[]> {
    if (isCloudDataEnabled()) {
      const db = getDb()!;
      const q = query(
        collection(db, 'users', uid(), 'activities'),
        orderBy('createdAt', 'desc'),
        limit(max)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Activity));
    }
    return this.list(max);
  },

  async addAsync(activity: Omit<Activity, 'id' | 'createdAt'>): Promise<Activity> {
    if (isCloudDataEnabled()) {
      const db = getDb()!;
      const ref = await addDoc(collection(db, 'users', uid(), 'activities'), {
        ...activity,
        createdAt: serverTimestamp(),
      });
      return { id: ref.id, ...activity, createdAt: new Date().toISOString() };
    }
    const item: Activity = {
      ...activity,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const all = storage.getJSON<Activity[]>(KEY, []);
    storage.setJSON(KEY, [item, ...all].slice(0, 100));
    return item;
  },
};
