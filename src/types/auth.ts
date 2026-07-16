export type AuthProvider = 'email' | 'google' | 'github';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  companyName?: string;
  avatarUrl?: string;
  provider: AuthProvider;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthRecord extends AuthUser {
  /** Optional for social-only accounts */
  passwordHash?: string;
  passwordSalt?: string;
  providerUserId?: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  token: string;
  provider: AuthProvider;
  createdAt: string;
  expiresAt: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  companyName?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SocialLoginInput {
  provider: 'google' | 'github';
  email: string;
  name: string;
  providerUserId: string;
  avatarUrl?: string;
}
