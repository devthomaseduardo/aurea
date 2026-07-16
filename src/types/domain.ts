export type Currency = 'BRL' | 'USD';

export type ProposalStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'accepted'
  | 'rejected'
  | 'expired';

export type ContractStatus =
  | 'draft'
  | 'pending_signature'
  | 'active'
  | 'completed'
  | 'cancelled';

export type ClientStatus = 'active' | 'inactive' | 'lead';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  document?: string;
  address?: string;
  notes?: string;
  status: ClientStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Proposal {
  id: string;
  title: string;
  clientId?: string;
  clientName: string;
  status: ProposalStatus;
  currency: Currency;
  totalValue: number;
  totalHours: number;
  totalDays: number;
  technologies: string[];
  model: 'basico' | 'padrao' | 'premium';
  projectSnapshot: unknown;
  resultSnapshot: unknown;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
}

export interface Contract {
  id: string;
  proposalId?: string;
  title: string;
  clientId?: string;
  clientName: string;
  status: ContractStatus;
  currency: Currency;
  totalValue: number;
  startDate?: string;
  endDate?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  type: 'proposal' | 'client' | 'contract' | 'calculation' | 'system';
  title: string;
  description?: string;
  entityId?: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  document?: string;
  address?: string;
  phone?: string;
  hourlyRate: number;
  currency: Currency;
  taxRegime: 'pf' | 'mei' | 'pj_simples' | 'pj_lucro_presumido';
  companyName?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface DashboardMetrics {
  revenue: number;
  clients: number;
  projects: number;
  hours: number;
  profit: number;
  pendingProposals: number;
  activeContracts: number;
  acceptanceRate: number;
}
