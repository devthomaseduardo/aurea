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

export type OSStatus =
  | 'received'         // Recebido
  | 'analyzing'        // Em análise
  | 'budget_pending'   // Aguardando aprovação de orçamento
  | 'repairing'        // Em reparo
  | 'ready'            // Pronto para retirada
  | 'delivered'        // Entregue
  | 'cancelled';       // Cancelado

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
  housingOk: boolean; // carcaça/vidro traseiro
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
  clientId: string;
  clientName: string;
  clientPhone?: string;
  deviceType: DeviceType;
  deviceBrand: string; // Ex: Apple, Samsung, Xiaomi, Motorola
  deviceModel: string; // Ex: iPhone 13 Pro, Galaxy S22
  deviceColor?: string;
  serialNumber?: string; // IMEI ou Número de Série
  passcode?: string; // Senha de desbloqueio para testes
  accessoriesLeft?: string; // Capa, Carregador, Chip, Cartão de Memória
  reportedIssue: string; // Defeito relatado pelo cliente
  technicalReport?: string; // Laudo técnico / diagnóstico
  checklist?: PhysicalChecklist;
  partsUsed?: OSPartItem[];
  status: OSStatus;
  laborPrice: number; // Mão de obra
  partsPrice: number; // Valor das peças
  totalValue: number;
  paymentStatus: OSPaymentStatus;
  warrantyDays: number; // Garantia padrão 90 dias
  notes?: string;
  createdAt: string;
  updatedAt: string;
  finishedAt?: string;
}

export type ItemCategory = 'parts' | 'devices' | 'accessories' | 'services';

export interface InventoryItem {
  id: string;
  name: string;
  category: ItemCategory;
  sku?: string;
  brand?: string;
  compatibleModels?: string[]; // Ex: ["iPhone 11", "iPhone 12"]
  quantity: number;
  minQuantity: number;
  costPrice: number;
  salePrice: number;
  location?: string; // Prateleira/Gaveta
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

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  document?: string; // CPF ou CNPJ
  address?: string;
  notes?: string;
  status: ClientStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  type: 'proposal' | 'client' | 'contract' | 'calculation' | 'system' | 'os' | 'inventory' | 'sale';
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
  projects?: number;
  profit?: number;
  acceptanceRate?: number;
}

