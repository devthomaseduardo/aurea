import { storage } from '@/core/storage/local-storage';
import { UserProfile } from '@/types/auth';
import { isCloudDataEnabled } from '@/core/db/mode';
import { getDb, getFirebaseAuth } from '@/core/firebase/app';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const KEY = 'aurea_profile';

export const profileService = {
  get(): UserProfile | null {
    return storage.getJSON<UserProfile | null>(KEY, null);
  },

  save(profile: UserProfile): void {
    storage.setJSON(KEY, profile);
  },

  async getAsync(): Promise<UserProfile | null> {
    if (isCloudDataEnabled()) {
      const auth = getFirebaseAuth()!;
      const u = auth.currentUser;
      if (!u) return null;
      const snap = await getDoc(doc(getDb()!, 'users', u.uid));
      if (!snap.exists()) return null;
      return snap.data() as UserProfile;
    }
    return this.get();
  },

  async saveAsync(profile: UserProfile): Promise<void> {
    if (isCloudDataEnabled()) {
      const auth = getFirebaseAuth()!;
      const u = auth.currentUser;
      if (!u) return;
      await setDoc(doc(getDb()!, 'users', u.uid), profile, { merge: true });
    }
    this.save(profile);
  },
};
