/**
 * Production config (Vite public env).
 *
 * Required for go-live (Firebase — not Supabase):
 *   VITE_FIREBASE_API_KEY=
 *   VITE_FIREBASE_AUTH_DOMAIN=
 *   VITE_FIREBASE_PROJECT_ID=
 *   VITE_FIREBASE_STORAGE_BUCKET=
 *   VITE_FIREBASE_MESSAGING_SENDER_ID=
 *   VITE_FIREBASE_APP_ID=
 *
 * Optional connector secrets (server-side only — Vercel env, no VITE_):
 *   GOOGLE_OAUTH_CLIENT_ID=
 *   GOOGLE_OAUTH_CLIENT_SECRET=
 *   GITHUB_OAUTH_CLIENT_ID=
 *   GITHUB_OAUTH_CLIENT_SECRET=
 *   STRIPE_SECRET_KEY=
 *   STRIPE_CLIENT_ID=
 *   TOKEN_ENCRYPTION_KEY=  (32+ char secret)
 */
function read(key: string): string | undefined {
  const v = import.meta.env[key] as string | undefined;
  return v && v.trim().length > 0 ? v.trim() : undefined;
}

export const ENV = {
  appUrl: read('VITE_APP_URL') || (typeof window !== 'undefined' ? window.location.origin : ''),
  firebase: {
    apiKey: read('VITE_FIREBASE_API_KEY'),
    authDomain: read('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: read('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: read('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: read('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: read('VITE_FIREBASE_APP_ID'),
    measurementId: read('VITE_FIREBASE_MEASUREMENT_ID'),
  },
  /** Client-side Stripe publishable key for Checkout / Connect return */
  stripePublishableKey: read('VITE_STRIPE_PUBLISHABLE_KEY'),
  googleOAuthClientId: read('VITE_GOOGLE_OAUTH_CLIENT_ID'),
  githubOAuthClientId: read('VITE_GITHUB_OAUTH_CLIENT_ID'),
} as const;

export function isFirebaseConfigured(): boolean {
  const f = ENV.firebase;
  return Boolean(
    f.apiKey && f.authDomain && f.projectId && f.appId
  );
}

export function isProductionCloud(): boolean {
  return isFirebaseConfigured();
}
