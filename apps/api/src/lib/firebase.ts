import admin from 'firebase-admin';

let initialized = false;

export function getAdminApp(): admin.app.App {
  if (initialized) return admin.app();

  // Opção A: service account JSON via env (produção / CI)
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (serviceAccountJson) {
    const serviceAccount = JSON.parse(serviceAccountJson) as admin.ServiceAccount;
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
    initialized = true;
    console.log('[firebase-admin] Initialized with service account JSON');
    return admin.app();
  }

  // Opção B: Application Default Credentials (gcloud auth / GOOGLE_APPLICATION_CREDENTIALS)
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
  initialized = true;
  console.log('[firebase-admin] Initialized with Application Default Credentials');
  return admin.app();
}

export function getAdminFirestore() {
  return getAdminApp().firestore();
}

export function getAdminAuth() {
  return getAdminApp().auth();
}
