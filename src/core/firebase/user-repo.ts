import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  type DocumentData,
} from 'firebase/firestore';
import { requireDb } from './app';
import { getFirebaseAuth } from './app';

export function requireUid(): string {
  const uid = getFirebaseAuth()?.currentUser?.uid;
  if (!uid) throw new Error('Usuário não autenticado no Firebase.');
  return uid;
}

export function userCol(name: string) {
  const db = requireDb();
  const uid = requireUid();
  return collection(db, 'users', uid, name);
}

export function userDoc(name: string, id: string) {
  const db = requireDb();
  const uid = requireUid();
  return doc(db, 'users', uid, name, id);
}

export function profileDoc() {
  const db = requireDb();
  const uid = requireUid();
  return doc(db, 'users', uid);
}

export async function listCollection<T extends { id: string }>(
  name: string,
  orderField = 'updatedAt'
): Promise<T[]> {
  const col = userCol(name);
  try {
    const q = query(col, orderBy(orderField, 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
  } catch {
    // collection empty or missing index — fallback unordered
    const snap = await getDocs(col);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
  }
}

export async function getDocument<T extends { id: string }>(
  name: string,
  id: string
): Promise<T | undefined> {
  const snap = await getDoc(userDoc(name, id));
  if (!snap.exists()) return undefined;
  return { id: snap.id, ...snap.data() } as T;
}

export async function setDocument(
  name: string,
  id: string,
  data: DocumentData
): Promise<void> {
  await setDoc(userDoc(name, id), data, { merge: true });
}

export async function removeDocument(name: string, id: string): Promise<void> {
  await deleteDoc(userDoc(name, id));
}

export async function getUserProfileData<T>(): Promise<T | null> {
  const snap = await getDoc(profileDoc());
  if (!snap.exists()) return null;
  return (snap.data().profile as T) ?? null;
}

export async function setUserProfileData(profile: DocumentData): Promise<void> {
  await setDoc(profileDoc(), { profile, updatedAt: new Date().toISOString() }, { merge: true });
}
