import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  GithubAuthProvider,
  onAuthStateChanged,
  type User as FirebaseUser,
  type AuthProvider as FirebaseAuthProvider,
} from 'firebase/auth';
import { getFirebaseAuth, requireAuth } from '@/core/firebase/app';
import { isFirebaseConfigured } from '@/core/config/env';
import { localStore, setStorageUserId } from '@/core/storage/local-storage';
import { generateId } from '@/shared/utils/utils';
import { hashPassword, verifyPassword } from './crypto';
import type {
  AuthRecord,
  AuthSession,
  AuthUser,
  AuthProvider,
  LoginInput,
  RegisterInput,
  SocialLoginInput,
} from '@/types/auth';
import { profileService } from '@/services/profile.service';
import { activitiesService } from '@/services/activities.service';

const USERS_KEY = 'auth_users';
const SESSION_KEY = 'auth_session';
const SESSION_DAYS = 14;

/** Prefer cloud (Firebase) when env is set */
export function isCloudAuth(): boolean {
  return isFirebaseConfigured();
}

function mapProvider(p?: string | null): AuthProvider {
  if (p === 'github.com' || p === 'github') return 'github';
  if (p === 'google.com' || p === 'google') return 'google';
  return 'email';
}

function firebaseToAuthUser(user: FirebaseUser): AuthUser {
  const providerId = user.providerData[0]?.providerId;
  return {
    id: user.uid,
    email: user.email || `${user.uid}@users.aurea.app`,
    name: user.displayName || user.email?.split('@')[0] || 'Usuário Aurea',
    avatarUrl: user.photoURL || undefined,
    provider: mapProvider(providerId),
    createdAt: user.metadata.creationTime
      ? new Date(user.metadata.creationTime).toISOString()
      : new Date().toISOString(),
    lastLoginAt: user.metadata.lastSignInTime
      ? new Date(user.metadata.lastSignInTime).toISOString()
      : new Date().toISOString(),
  };
}

function toPublicUser(record: AuthRecord): AuthUser {
  return {
    id: record.id,
    email: record.email,
    name: record.name,
    companyName: record.companyName,
    avatarUrl: record.avatarUrl,
    provider: record.provider,
    createdAt: record.createdAt,
    lastLoginAt: record.lastLoginAt,
  };
}

function getUsers(): AuthRecord[] {
  return localStore.getGlobal<AuthRecord[]>(USERS_KEY, []);
}

function saveUsers(users: AuthRecord[]) {
  localStore.setGlobal(USERS_KEY, users);
}

function createLocalSession(user: AuthUser): AuthSession {
  const now = Date.now();
  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    token: generateId('sess'),
    provider: user.provider,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString(),
  };
}

function isSessionValid(session: AuthSession | null): session is AuthSession {
  if (!session) return false;
  return new Date(session.expiresAt).getTime() > Date.now();
}

async function bootstrapWorkspace(user: AuthUser) {
  setStorageUserId(user.id);
  try {
    const existing = await profileService.getAsync();
    if (!existing?.name || existing.email === 'developer.thomas@outlook.com.br') {
      await profileService.updateAsync({
        name: user.name,
        email: user.email,
        companyName: user.companyName ?? '',
        hourlyRate: existing?.hourlyRate ?? 120,
        currency: existing?.currency ?? 'BRL',
        taxRegime: existing?.taxRegime ?? 'mei',
        bio: existing?.bio || `Conta Aurea · ${user.provider}`,
        avatarUrl: user.avatarUrl,
      });
      await activitiesService.addAsync({
        type: 'system',
        title: 'Workspace pronto',
        description: `Login via ${user.provider}. Dados vinculados a ${user.email}.`,
      });
    } else if (user.avatarUrl) {
      await profileService.updateAsync({
        avatarUrl: user.avatarUrl,
        name: user.name || existing.name,
      });
    }
  } catch {
    // local bootstrap fallback
    const existing = localStore.get('profile', null as null | object);
    if (!existing) {
      profileService.update({
        name: user.name,
        email: user.email,
        companyName: user.companyName ?? '',
        hourlyRate: 120,
        currency: 'BRL',
        taxRegime: 'mei',
        bio: `Conta Aurea · ${user.provider}`,
        avatarUrl: user.avatarUrl,
      });
    }
  }
}

/* ─── Local (dev without Firebase) ─── */

async function localRegister(input: RegisterInput): Promise<AuthUser> {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  if (!email || !name || input.password.length < 6) {
    throw new Error('Preencha nome, e-mail e senha (mín. 6 caracteres).');
  }
  const users = getUsers();
  if (users.some((u) => u.email === email)) {
    throw new Error('Já existe uma conta com este e-mail.');
  }
  const { hash, salt } = await hashPassword(input.password);
  const now = new Date().toISOString();
  const record: AuthRecord = {
    id: generateId('usr'),
    email,
    name,
    companyName: input.companyName?.trim() || undefined,
    passwordHash: hash,
    passwordSalt: salt,
    provider: 'email',
    createdAt: now,
    lastLoginAt: now,
  };
  saveUsers([...users, record]);
  const user = toPublicUser(record);
  localStore.setGlobal(SESSION_KEY, createLocalSession(user));
  await bootstrapWorkspace(user);
  return user;
}

async function localLogin(input: LoginInput): Promise<AuthUser> {
  const email = input.email.trim().toLowerCase();
  const record = getUsers().find((u) => u.email === email);
  if (!record?.passwordHash || !record.passwordSalt) {
    throw new Error('E-mail ou senha inválidos.');
  }
  const ok = await verifyPassword(input.password, record.passwordSalt, record.passwordHash);
  if (!ok) throw new Error('E-mail ou senha inválidos.');
  record.lastLoginAt = new Date().toISOString();
  saveUsers(getUsers().map((u) => (u.id === record.id ? record : u)));
  const user = toPublicUser(record);
  localStore.setGlobal(SESSION_KEY, createLocalSession(user));
  await bootstrapWorkspace(user);
  return user;
}

async function localSocial(input: SocialLoginInput): Promise<AuthUser> {
  const email = input.email.trim().toLowerCase();
  let record =
    getUsers().find(
      (u) => u.providerUserId === input.providerUserId && u.provider === input.provider
    ) || getUsers().find((u) => u.email === email);

  const now = new Date().toISOString();
  if (!record) {
    record = {
      id: generateId('usr'),
      email,
      name: input.name,
      provider: input.provider,
      providerUserId: input.providerUserId,
      avatarUrl: input.avatarUrl,
      createdAt: now,
      lastLoginAt: now,
    };
    saveUsers([...getUsers(), record]);
  } else {
    record = {
      ...record,
      name: input.name || record.name,
      provider: input.provider,
      providerUserId: input.providerUserId,
      avatarUrl: input.avatarUrl || record.avatarUrl,
      lastLoginAt: now,
    };
    saveUsers(getUsers().map((u) => (u.id === record!.id ? record! : u)));
  }
  const user = toPublicUser(record);
  localStore.setGlobal(SESSION_KEY, createLocalSession(user));
  await bootstrapWorkspace(user);
  return user;
}

/* ─── Firebase (production) ─── */

/** Map Firebase Auth errors to actionable PT-BR messages */
function mapFirebaseAuthError(err: unknown): Error {
  const code =
    err && typeof err === 'object' && 'code' in err
      ? String((err as { code: string }).code)
      : '';
  const raw = err instanceof Error ? err.message : String(err);

  const table: Record<string, string> = {
    'auth/configuration-not-found':
      'Firebase Authentication ainda não foi ativado. No console: Authentication → Começar → ative Email/senha e Google.',
    'auth/operation-not-allowed':
      'Este método de login está desativado. Em Authentication → Sign-in method, ative Email/senha, Google ou GitHub.',
    'auth/invalid-api-key':
      'API key Firebase inválida. Confira VITE_FIREBASE_API_KEY no .env.local.',
    'auth/unauthorized-domain':
      'Este domínio não está autorizado. Em Authentication → Settings → Authorized domains, adicione localhost e seu domínio.',
    'auth/popup-blocked':
      'O popup de login foi bloqueado pelo navegador. Permita popups para este site.',
    'auth/popup-closed-by-user':
      'Login cancelado: a janela de autorização foi fechada.',
    'auth/email-already-in-use':
      'Já existe uma conta com este e-mail. Faça login ou use outro e-mail.',
    'auth/invalid-email': 'E-mail inválido.',
    'auth/user-not-found': 'E-mail ou senha inválidos.',
    'auth/wrong-password': 'E-mail ou senha inválidos.',
    'auth/invalid-credential': 'E-mail ou senha inválidos.',
    'auth/weak-password': 'Senha fraca. Use no mínimo 6 caracteres.',
    'auth/too-many-requests':
      'Muitas tentativas. Aguarde alguns minutos e tente de novo.',
    'auth/network-request-failed':
      'Falha de rede ao falar com o Firebase. Verifique sua conexão.',
    'auth/account-exists-with-different-credential':
      'Este e-mail já está cadastrado com outro provedor (ex.: Google vs e-mail).',
  };

  if (code && table[code]) return new Error(table[code]);
  if (raw.includes('configuration-not-found')) return new Error(table['auth/configuration-not-found']);
  return err instanceof Error ? err : new Error(raw || 'Falha na autenticação Firebase');
}

async function cloudRegister(input: RegisterInput): Promise<AuthUser> {
  try {
    const auth = requireAuth();
    const cred = await createUserWithEmailAndPassword(
      auth,
      input.email.trim().toLowerCase(),
      input.password
    );
    await updateProfile(cred.user, { displayName: input.name.trim() });
    const user = firebaseToAuthUser(cred.user);
    user.name = input.name.trim();
    user.companyName = input.companyName?.trim();
    await bootstrapWorkspace(user);
    return user;
  } catch (e) {
    throw mapFirebaseAuthError(e);
  }
}

async function cloudLogin(input: LoginInput): Promise<AuthUser> {
  try {
    const auth = requireAuth();
    const cred = await signInWithEmailAndPassword(
      auth,
      input.email.trim().toLowerCase(),
      input.password
    );
    const user = firebaseToAuthUser(cred.user);
    await bootstrapWorkspace(user);
    return user;
  } catch (e) {
    throw mapFirebaseAuthError(e);
  }
}

async function cloudProvider(provider: 'google' | 'github'): Promise<AuthUser> {
  try {
    const auth = requireAuth();
    let authProvider: FirebaseAuthProvider;
    if (provider === 'google') {
      const g = new GoogleAuthProvider();
      g.addScope('email');
      g.addScope('profile');
      // Scopes for working connectors after login
      g.addScope('https://www.googleapis.com/auth/gmail.send');
      g.addScope('https://www.googleapis.com/auth/calendar.events');
      g.setCustomParameters({ prompt: 'select_account' });
      authProvider = g;
    } else {
      const gh = new GithubAuthProvider();
      gh.addScope('read:user');
      gh.addScope('user:email');
      gh.addScope('repo');
      authProvider = gh;
    }

    const result = await signInWithPopup(auth, authProvider);
    const user = firebaseToAuthUser(result.user);

    // Persist OAuth access token for connectors
    const credential =
      provider === 'google'
        ? GoogleAuthProvider.credentialFromResult(result)
        : GithubAuthProvider.credentialFromResult(result);

    const accessToken = credential?.accessToken;
    if (accessToken) {
      const { pluginsService } = await import('@/services/plugins.service');
      await pluginsService.connectWithToken(
        provider === 'google' ? 'google-workspace' : 'github',
        {
          accessToken,
          accountLabel: user.email,
          provider,
        }
      );
    }

    await bootstrapWorkspace(user);
    return user;
  } catch (e) {
    throw mapFirebaseAuthError(e);
  }
}

export const authService = {
  isCloudAuth,
  isSocialOAuthLive: isCloudAuth,

  /** Resolve current user (Firebase or local session) */
  async getCurrentUserAsync(): Promise<AuthUser | null> {
    if (isCloudAuth()) {
      const auth = getFirebaseAuth();
      if (!auth) return null;
      const fbUser = auth.currentUser;
      if (fbUser) {
        const user = firebaseToAuthUser(fbUser);
        setStorageUserId(user.id);
        return user;
      }
      return new Promise((resolve) => {
        const unsub = onAuthStateChanged(auth, async (u) => {
          unsub();
          if (!u) {
            setStorageUserId(null);
            resolve(null);
            return;
          }
          const user = firebaseToAuthUser(u);
          setStorageUserId(user.id);
          resolve(user);
        });
      });
    }

    const session = localStore.getGlobal<AuthSession | null>(SESSION_KEY, null);
    if (!isSessionValid(session)) {
      if (session) localStore.removeGlobal(SESSION_KEY);
      setStorageUserId(null);
      return null;
    }
    setStorageUserId(session.userId);
    const record = getUsers().find((u) => u.id === session.userId);
    return record ? toPublicUser(record) : null;
  },

  getCurrentUser(): AuthUser | null {
    if (isCloudAuth()) {
      const u = getFirebaseAuth()?.currentUser;
      if (!u) return null;
      const user = firebaseToAuthUser(u);
      setStorageUserId(user.id);
      return user;
    }
    const session = localStore.getGlobal<AuthSession | null>(SESSION_KEY, null);
    if (!isSessionValid(session)) {
      setStorageUserId(null);
      return null;
    }
    setStorageUserId(session.userId);
    const record = getUsers().find((u) => u.id === session.userId);
    return record ? toPublicUser(record) : null;
  },

  getSession(): AuthSession | null {
    if (isCloudAuth()) {
      const u = this.getCurrentUser();
      if (!u) return null;
      return createLocalSession(u);
    }
    const session = localStore.getGlobal<AuthSession | null>(SESSION_KEY, null);
    if (!isSessionValid(session)) {
      if (session) localStore.removeGlobal(SESSION_KEY);
      setStorageUserId(null);
      return null;
    }
    setStorageUserId(session.userId);
    return session;
  },

  async register(input: RegisterInput): Promise<AuthUser> {
    if (isCloudAuth()) return cloudRegister(input);
    return localRegister(input);
  },

  async login(input: LoginInput): Promise<AuthUser> {
    if (isCloudAuth()) return cloudLogin(input);
    return localLogin(input);
  },

  async loginWithProvider(provider: 'google' | 'github'): Promise<'redirect' | AuthUser> {
    if (isCloudAuth()) {
      const user = await cloudProvider(provider);
      return user;
    }
    // Dev fallback without Firebase — still works for demos
    return localSocial({
      provider,
      email: `${provider}.user@aurea.app`,
      name: provider === 'google' ? 'Usuário Google' : 'Usuário GitHub',
      providerUserId: `${provider}_local_demo`,
    });
  },

  async loginWithSocialProfile(input: SocialLoginInput): Promise<AuthUser> {
    return localSocial(input);
  },

  async completeOAuthCallback(): Promise<AuthUser | null> {
    // Firebase popup flow does not need callback page, but keep for deep links
    return this.getCurrentUserAsync();
  },

  async logout(): Promise<void> {
    if (isCloudAuth()) {
      const auth = getFirebaseAuth();
      if (auth) await signOut(auth);
    }
    localStore.removeGlobal(SESSION_KEY);
    setStorageUserId(null);
  },

  async ensureDemoAccount(): Promise<{ email: string; password: string }> {
    const email = 'demo@aurea.app';
    const password = 'demo1234';
    if (isCloudAuth()) {
      try {
        await this.login({ email, password });
        await this.logout();
      } catch {
        try {
          await this.register({
            name: 'Usuário Demo',
            email,
            password,
            companyName: 'Aurea Demo',
          });
          await this.logout();
        } catch {
          // may already exist with different password
        }
      }
      return { email, password };
    }
    const users = getUsers();
    if (!users.some((u) => u.email === email)) {
      await this.register({
        name: 'Usuário Demo',
        email,
        password,
        companyName: 'Aurea Demo Studio',
      });
      await this.logout();
    }
    return { email, password };
  },

  /** Subscribe to Firebase auth state */
  onAuthChanged(cb: (user: AuthUser | null) => void): () => void {
    if (!isCloudAuth()) {
      cb(this.getCurrentUser());
      return () => undefined;
    }
    const auth = getFirebaseAuth();
    if (!auth) {
      cb(null);
      return () => undefined;
    }
    return onAuthStateChanged(auth, (u) => {
      if (!u) {
        setStorageUserId(null);
        cb(null);
        return;
      }
      const user = firebaseToAuthUser(u);
      setStorageUserId(user.id);
      cb(user);
    });
  },
};
