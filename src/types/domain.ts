export type Currency = 'BRL' | 'USD';

export type ClientStatus = 'active' | 'inactive' | 'lead';

export type OSStatus =
  | 'received'
  | 'analyzing'
  | 'budget_pending'
  | 'repairing'
  | 'testing'
  | 'ready'
  | 'delivered'
  | 'cancelled';

export type OSPaymentStatus = 'pending' | 'paid' | 'refunded';
export type DeviceType = 'phone' | 'tablet' | 'smartwatch' | 'computer' | 'other';

export interface PhysicalChecklist {
  screenOk: boolean;
  touchOk: boolean;
  cameraOk: boolean;
  buttonsOk: boolean;
  chargingOk: boolean;
  wifiOk: boolean;
  audioOk: boolean;
  biometricsOk: boolean;
  housingOk: boolean;
  waterDamage: boolean;
}

export interface OSPartItem {
  id: string;
  partId?: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface ServiceOrder {
  id: string;
  companyId?: string;
  clientId: string;
  clientName: string;
  clientPhone?: string;
  deviceType: DeviceType;
  deviceBrand: string;
  deviceModel: string;
  deviceImageUrl?: string;
  deviceColor?: string;
  serialNumber?: string;
  passcode?: string;
  accessoriesLeft?: string;
  reportedIssue: string;
  technicalReport?: string;
  checklist?: PhysicalChecklist;
  partsUsed?: OSPartItem[];
  status: OSStatus;
  technicianId?: string;
  technicianName?: string;
  laborPrice: number;
  partsPrice: number;
  totalValue: number;
  paymentStatus: OSPaymentStatus;
  warrantyDays: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  finishedAt?: string;
}

export type ItemCategory = 'parts' | 'devices' | 'accessories' | 'services';

export interface InventoryItem {
  id: string;
  companyId?: string;
  name: string;
  category: ItemCategory;
  sku?: string;
  brand?: string;
  compatibleModels?: string[];
  quantity: number;
  minQuantity: number;
  costPrice: number;
  salePrice: number;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = 'pix' | 'credit_card' | 'debit_card' | 'cash';

export interface SaleItem {
  itemId?: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Sale {
  id: string;
  companyId?: string;
  clientId?: string;
  clientName?: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  totalValue: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
}

export interface DeviceModel {
  id: string;
  brand: 'Apple' | 'Samsung' | 'Xiaomi' | 'Motorola' | 'Outros';
  model: string;
  category: DeviceType;
  imageUrl: string;
  screenCostAvg: number;
  batteryCostAvg: number;
  releaseYear?: number;
}

export interface Technician {
  id: string;
  name: string;
  role: 'Técnico Senior' | 'Técnico Pleno' | 'Atendente Balcão' | 'Gerente';
  specialties: string[];
  phone: string;
  email: string;
  avatarUrl?: string;
  activeOSCount: number;
  completedOSCount: number;
  status: 'active' | 'inactive';
}

export interface WarrantyRecord {
  id: string;
  osId: string;
  clientName: string;
  clientPhone: string;
  deviceModel: string;
  partsReplaced: string[];
  warrantyDays: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'claimed';
}

export interface TenantCompany {
  id: string;
  name: string;
  legalName: string;
  slug: string;
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
  phone: string;
  whatsapp: string;
  address: string;
  cnpj: string;
  warrantyDays: number;
  warrantyTerms: string;
}

export interface Client {
  id: string;
  companyId?: string;
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

export type ProposalStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'accepted'
  | 'rejected'
  | 'expired';

export interface Proposal {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  status: ProposalStatus;
  currency: Currency;
  totalValue: number;
  totalHours: number;
  totalDays: number;
  technologies: string[];
  model: string;
  notes?: string;
  projectSnapshot?: unknown | null;
  resultSnapshot?: unknown | null;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
}

export type ContractStatus =
  | 'draft'
  | 'pending_signature'
  | 'active'
  | 'completed'
  | 'cancelled';

export interface Contract {
  id: string;
  proposalId?: string;
  title: string;
  clientId: string;
  clientName: string;
  status: ContractStatus;
  currency: Currency;
  totalValue: number;
  startDate?: string;
  endDate?: string;
  content?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  type: 'client' | 'system' | 'os' | 'inventory' | 'sale' | 'device' | 'team' | 'proposal' | 'contract';
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
  warrantyTerms?: string;
}

export interface DashboardMetrics {
  revenue: number;
  salesRevenue: number;
  repairRevenue: number;
  clients: number;
  activeOS: number;
  completedOS: number;
  pendingBudgets: number;
  readyOS: number;
  lowStockItemsCount: number;
  averageTicket: number;
  hours?: number;
  profit?: number;
  acceptanceRate?: number;
  pendingProposals?: number;
}
