import { isFirebaseConfigured } from '@/core/config/env';
import { getFirebaseAuth } from '@/core/firebase/app';

/** True when we should read/write Firestore (production multi-user) */
export function isCloudDataEnabled(): boolean {
  return isFirebaseConfigured() && Boolean(getFirebaseAuth()?.currentUser);
}
