import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { ENV, isFirebaseConfigured } from '@/core/config/env';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  if (!app) {
    app =
      getApps()[0] ??
      initializeApp({
        apiKey: ENV.firebase.apiKey,
        authDomain: ENV.firebase.authDomain,
        projectId: ENV.firebase.projectId,
        storageBucket: ENV.firebase.storageBucket,
        messagingSenderId: ENV.firebase.messagingSenderId,
        appId: ENV.firebase.appId,
      });
  }
  return app;
}

export function getFirebaseAuth(): Auth | null {
  const a = getFirebaseApp();
  if (!a) return null;
  if (!auth) auth = getAuth(a);
  return auth;
}

export function getDb(): Firestore | null {
  const a = getFirebaseApp();
  if (!a) return null;
  if (!db) db = getFirestore(a);
  return db;
}

export function requireDb(): Firestore {
  const d = getDb();
  if (!d) {
    throw new Error(
      'Firebase não configurado. Defina VITE_FIREBASE_* no .env para produção.'
    );
  }
  return d;
}

export function requireAuth(): Auth {
  const a = getFirebaseAuth();
  if (!a) {
    throw new Error(
      'Firebase Auth não configurado. Defina VITE_FIREBASE_* no .env.'
    );
  }
  return a;
}
