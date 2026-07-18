// ─── Proposal ─────────────────────────────────────────────────────
export type ProposalStatus =
  | 'draft'
  | 'sent'
  | 'negotiating'
  | 'accepted'
  | 'rejected'
  | 'archived';

export interface Proposal {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  status: ProposalStatus;
  totalValue: number;
  currency: string;
  technologies: string[];
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  expiresAt?: string;
}

// ─── Client ───────────────────────────────────────────────────────
export interface Client {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Contract ─────────────────────────────────────────────────────
export type ContractStatus = 'draft' | 'sent' | 'signed' | 'completed' | 'cancelled';

export interface Contract {
  id: string;
  proposalId: string;
  clientId: string;
  title: string;
  status: ContractStatus;
  totalValue: number;
  currency: string;
  signedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Auth ─────────────────────────────────────────────────────────
export type AuthProvider = 'email' | 'google' | 'github';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  companyName?: string;
  avatarUrl?: string;
  provider: AuthProvider;
  createdAt: string;
  lastLoginAt: string;
}

// ─── API ──────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ─── Analytics ────────────────────────────────────────────────────
export interface DashboardStats {
  totalRevenue: number;
  acceptedProposals: number;
  activeClients: number;
  activeContracts: number;
  conversionRate: number;
}
