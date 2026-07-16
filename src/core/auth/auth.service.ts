import { localStore, setStorageUserId } from '@/core/storage/local-storage';
import { generateId } from '@/shared/utils/utils';
import { hashPassword, verifyPassword } from './crypto';
import { getSupabase, isSupabaseConfigured } from './supabase';
import { ENV } from '@/core/config/env';
import type {
  AuthProvider,
  AuthRecord,
  AuthSession,
  AuthUser,
  LoginInput,
  RegisterInput,
  SocialLoginInput,
} from '@/types/auth';
import { profileService } from '@/services/profile.service';
import { activitiesService } from '@/services/activities.service';

const USERS_KEY = 'auth_users';
const SESSION_KEY = 'auth_session';
const SESSION_DAYS = 14;

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

function createSession(user: AuthUser): AuthSession {
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

function bootstrapUserWorkspace(user: AuthUser) {
  setStorageUserId(user.id);
  const existing = localStore.get('profile', null as null | object);
  if (!existing) {
    profileService.update({
      name: user.name,
      email: user.email,
      companyName: user.companyName ?? '',
      hourlyRate: 120,
      currency: 'BRL',
      taxRegime: 'mei',
      bio: `Conta Aurea via ${user.provider}`,
      avatarUrl: user.avatarUrl,
    });
    activitiesService.add({
      type: 'system',
      title: 'Workspace criado',
      description: `Bem-vindo(a), ${user.name}. Login via ${user.provider}.`,
    });
  } else if (user.avatarUrl) {
    profileService.update({ avatarUrl: user.avatarUrl, name: user.name });
  }
}

function persistLogin(record: AuthRecord): AuthUser {
  record.lastLoginAt = new Date().toISOString();
  const users = getUsers();
  const next = users.some((u) => u.id === record.id)
    ? users.map((u) => (u.id === record.id ? record : u))
    : [...users, record];
  saveUsers(next);

  const publicUser = toPublicUser(record);
  const session = createSession(publicUser);
  localStore.setGlobal(SESSION_KEY, session);
  bootstrapUserWorkspace(publicUser);

  activitiesService.add({
    type: 'system',
    title: 'Login realizado',
    description: `${record.provider.toUpperCase()} · ${new Date().toLocaleString('pt-BR')}`,
  });

  return publicUser;
}

export const authService = {
  isSocialOAuthLive() {
    return isSupabaseConfigured();
  },

  getSession(): AuthSession | null {
    const session = localStore.getGlobal<AuthSession | null>(SESSION_KEY, null);
    if (!isSessionValid(session)) {
      if (session) localStore.removeGlobal(SESSION_KEY);
      setStorageUserId(null);
      return null;
    }
    setStorageUserId(session.userId);
    return session;
  },

  getCurrentUser(): AuthUser | null {
    const session = this.getSession();
    if (!session) return null;
    const user = getUsers().find((u) => u.id === session.userId);
    return user ? toPublicUser(user) : null;
  },

  async register(input: RegisterInput): Promise<AuthUser> {
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
    return persistLogin(record);
  },

  async login(input: LoginInput): Promise<AuthUser> {
    const email = input.email.trim().toLowerCase();
    const users = getUsers();
    const record = users.find((u) => u.email === email);
    if (!record || !record.passwordHash || !record.passwordSalt) {
      throw new Error('E-mail ou senha inválidos.');
    }

    const ok = await verifyPassword(
      input.password,
      record.passwordSalt,
      record.passwordHash
    );
    if (!ok) {
      throw new Error('E-mail ou senha inválidos.');
    }

    return persistLogin(record);
  },

  /**
   * Social login:
   * - With Supabase env → real OAuth redirect (Google/GitHub)
   * - Without → local provider account (dev/demo), still isolated by user
   */
  async loginWithProvider(provider: 'google' | 'github'): Promise<'redirect' | AuthUser> {
    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${ENV.appUrl}/auth/callback`,
          queryParams:
            provider === 'google'
              ? { access_type: 'offline', prompt: 'consent' }
              : undefined,
        },
      });
      if (error) throw new Error(error.message);
      return 'redirect';
    }

    // Local social simulation for environments without OAuth keys
    return this.loginWithSocialProfile({
      provider,
      email: `${provider}.user@aurea.app`,
      name: provider === 'google' ? 'Usuário Google' : 'Usuário GitHub',
      providerUserId: `${provider}_local_demo`,
      avatarUrl: undefined,
    });
  },

  async loginWithSocialProfile(input: SocialLoginInput): Promise<AuthUser> {
    const email = input.email.trim().toLowerCase();
    const users = getUsers();
    let record =
      users.find(
        (u) =>
          u.providerUserId === input.providerUserId && u.provider === input.provider
      ) || users.find((u) => u.email === email);

    if (!record) {
      const now = new Date().toISOString();
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
    } else {
      record = {
        ...record,
        name: input.name || record.name,
        provider: input.provider,
        providerUserId: input.providerUserId,
        avatarUrl: input.avatarUrl || record.avatarUrl,
      };
    }

    return persistLogin(record);
  },

  /** Complete Supabase OAuth redirect */
  async completeOAuthCallback(): Promise<AuthUser | null> {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data, error } = await supabase.auth.getSession();
    if (error) throw new Error(error.message);
    const session = data.session;
    if (!session?.user) return null;

    const meta = session.user.user_metadata || {};
    const provider = (session.user.app_metadata?.provider || 'google') as
      | 'google'
      | 'github';

    return this.loginWithSocialProfile({
      provider: provider === 'github' ? 'github' : 'google',
      email: session.user.email || `${session.user.id}@oauth.aurea.app`,
      name:
        meta.full_name ||
        meta.name ||
        meta.user_name ||
        session.user.email?.split('@')[0] ||
        'Usuário Aurea',
      providerUserId: session.user.id,
      avatarUrl: meta.avatar_url || meta.picture,
    });
  },

  async logout(): Promise<void> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut().catch(() => undefined);
    }
    localStore.removeGlobal(SESSION_KEY);
    setStorageUserId(null);
  },

  async ensureDemoAccount(): Promise<{ email: string; password: string }> {
    const email = 'demo@aurea.app';
    const password = 'demo123';
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
};
