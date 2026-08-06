import { ServiceOrder, OSStatus, OSPartItem, PhysicalChecklist } from '@/types/domain';
import { APP_CONFIG } from '@/core/config/app.config';
import { inventoryService } from './inventory.service';
import { activitiesService } from './activities.service';

const STORAGE_KEY = `${APP_CONFIG.storagePrefix}_service_orders`;

const DEFAULT_CHECKLIST: PhysicalChecklist = {
  screenOk: true,
  touchOk: true,
  cameraOk: true,
  buttonsOk: true,
  chargingOk: true,
  wifiOk: true,
  audioOk: true,
  biometricsOk: true,
  housingOk: true,
  waterDamage: false,
};

const DEFAULT_ORDERS: ServiceOrder[] = [
  {
    id: 'OS-2026-001',
    clientId: 'cli-001',
    clientName: 'Carlos Eduardo Silva',
    clientPhone: '(11) 98765-4321',
    deviceType: 'phone',
    deviceBrand: 'Apple',
    deviceModel: 'iPhone 13 Pro',
    deviceColor: 'Sierra Blue',
    serialNumber: '358921098412345',
    passcode: '123456',
    accessoriesLeft: 'Capinha transparente',
    reportedIssue: 'Tela quebrada após queda, touch parou de funcionar na parte superior.',
    technicalReport: 'Substituição de display OLED premium e limpeza interna dos conectores.',
    checklist: {
      ...DEFAULT_CHECKLIST,
      screenOk: false,
      touchOk: false,
      housingOk: false,
    },
    partsUsed: [
      {
        id: 'p1',
        partId: 'PART-001',
        name: 'Tela Frontal iPhone 13 OLED Premium',
        quantity: 1,
        unitPrice: 550,
      },
    ],
    status: 'repairing',
    laborPrice: 150,
    partsPrice: 550,
    totalValue: 700,
    paymentStatus: 'pending',
    warrantyDays: 90,
    notes: 'Cliente solicitou prioridade pois usa o aparelho para trabalho.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'OS-2026-002',
    clientId: 'cli-002',
    clientName: 'Mariana Oliveira Santos',
    clientPhone: '(11) 97654-3210',
    deviceType: 'phone',
    deviceBrand: 'Samsung',
    deviceModel: 'Galaxy S21 Ultra',
    deviceColor: 'Phantom Black',
    serialNumber: '354891002938471',
    passcode: 'Padrao em Z',
    accessoriesLeft: 'Nenhum',
    reportedIssue: 'Aparelho não carrega e esquenta muito ao conectar o cabo.',
    technicalReport: 'Conector de carga oxidadado. Necessária substituição da placa sub conector.',
    checklist: {
      ...DEFAULT_CHECKLIST,
      chargingOk: false,
    },
    partsUsed: [
      {
        id: 'p2',
        partId: 'PART-003',
        name: 'Conector de Carga USB-C Samsung S21',
        quantity: 1,
        unitPrice: 120,
      },
    ],
    status: 'ready',
    laborPrice: 100,
    partsPrice: 120,
    totalValue: 220,
    paymentStatus: 'pending',
    warrantyDays: 90,
    notes: 'Testado carregamento rápido por 1 hora com sucesso.',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'OS-2026-003',
    clientId: 'cli-003',
    clientName: 'Roberto Ferreira Melo',
    clientPhone: '(11) 91234-5678',
    deviceType: 'phone',
    deviceBrand: 'Motorola',
    deviceModel: 'Moto G60',
    deviceColor: 'Prata',
    serialNumber: '352901928374651',
    accessoriesLeft: 'Carregador original TurboPower',
    reportedIssue: 'Bateria descarrega muito rápido, desligando com 30%.',
    technicalReport: 'Bateria estufada com saúde reduzida para 54%.',
    checklist: {
      ...DEFAULT_CHECKLIST,
    },
    partsUsed: [
      {
        id: 'p3',
        partId: 'PART-002',
        name: 'Bateria Original Moto G60 6000mAh',
        quantity: 1,
        unitPrice: 160,
      },
    ],
    status: 'delivered',
    laborPrice: 90,
    partsPrice: 160,
    totalValue: 250,
    paymentStatus: 'paid',
    warrantyDays: 90,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    finishedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

export const OS_STATUS_LABELS: Record<OSStatus, { label: string; color: string; description: string }> = {
  received: {
    label: 'Recebido',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'Aparelho recebido no balcão e aguardando triagem.',
  },
  analyzing: {
    label: 'Em Análise',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    description: 'Técnico efetuando testes e diagnóstico.',
  },
  budget_pending: {
    label: 'Aguardando Aprovação',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    description: 'Orçamento gerado e enviado ao cliente para aprovação.',
  },
  repairing: {
    label: 'Em Reparo',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    description: 'Manutenção em andamento pela equipe técnica.',
  },
  ready: {
    label: 'Pronto para Retirada',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description: 'Conserto finalizado, testado e pronto no balcão.',
  },
  delivered: {
    label: 'Entregue / Concluído',
    color: 'bg-slate-100 text-slate-800 border-slate-200',
    description: 'Aparelho entregue ao cliente com garantia ativada.',
  },
  cancelled: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800 border-red-200',
    description: 'Serviço cancelado ou orçamento recusado.',
  },
};

class OrdersService {
  private getOrders(): ServiceOrder[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ORDERS));
        return DEFAULT_ORDERS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_ORDERS;
    }
  }

  private saveOrders(orders: ServiceOrder[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }

  list(query?: string, statusFilter?: OSStatus | 'all'): ServiceOrder[] {
    let orders = this.getOrders();

    if (statusFilter && statusFilter !== 'all') {
      orders = orders.filter((o) => o.status === statusFilter);
    }

    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      orders = orders.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.clientName.toLowerCase().includes(q) ||
          (o.clientPhone && o.clientPhone.includes(q)) ||
          o.deviceBrand.toLowerCase().includes(q) ||
          o.deviceModel.toLowerCase().includes(q) ||
          (o.serialNumber && o.serialNumber.toLowerCase().includes(q))
      );
    }

    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getById(id: string): ServiceOrder | undefined {
    return this.getOrders().find((o) => o.id.toUpperCase() === id.toUpperCase());
  }

  getByPhoneOrCode(term: string): ServiceOrder[] {
    const cleanTerm = term.replace(/\D/g, '').toLowerCase();
    const rawTerm = term.toLowerCase().trim();

    return this.getOrders().filter((o) => {
      const matchId = o.id.toLowerCase().includes(rawTerm);
      const matchPhone = o.clientPhone ? o.clientPhone.replace(/\D/g, '').includes(cleanTerm) : false;
      const matchSerial = o.serialNumber ? o.serialNumber.toLowerCase().includes(rawTerm) : false;
      return matchId || (cleanTerm.length >= 4 && matchPhone) || matchSerial;
    });
  }

  create(data: Omit<ServiceOrder, 'id' | 'createdAt' | 'updatedAt'>): ServiceOrder {
    const orders = this.getOrders();
    const count = orders.length + 1;
    const year = new Date().getFullYear();
    const id = `OS-${year}-${String(count).padStart(3, '0')}`;

    const partsPrice = (data.partsUsed || []).reduce((acc, p) => acc + p.unitPrice * p.quantity, 0);
    const totalValue = partsPrice + (data.laborPrice || 0);

    const newOrder: ServiceOrder = {
      ...data,
      id,
      partsPrice,
      totalValue,
      checklist: data.checklist || DEFAULT_CHECKLIST,
      warrantyDays: data.warrantyDays ?? 90,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Deduct stock for parts used
    if (newOrder.partsUsed && newOrder.partsUsed.length > 0) {
      newOrder.partsUsed.forEach((part) => {
        if (part.partId) {
          inventoryService.deductStock(part.partId, part.quantity);
        }
      });
    }

    orders.unshift(newOrder);
    this.saveOrders(orders);

    activitiesService.log({
      type: 'os',
      title: `Nova OS Criada: ${newOrder.id}`,
      description: `Aparelho: ${newOrder.deviceBrand} ${newOrder.deviceModel} - Cliente: ${newOrder.clientName}`,
      entityId: newOrder.id,
    });

    return newOrder;
  }

  update(id: string, data: Partial<Omit<ServiceOrder, 'id' | 'createdAt'>>): ServiceOrder | undefined {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) return undefined;

    const currentOrder = orders[index];
    const updatedPartsPrice = data.partsUsed
      ? data.partsUsed.reduce((acc, p) => acc + p.unitPrice * p.quantity, 0)
      : currentOrder.partsPrice;

    const updatedLaborPrice = data.laborPrice !== undefined ? data.laborPrice : currentOrder.laborPrice;
    const updatedTotalValue = updatedPartsPrice + updatedLaborPrice;

    const finishedAt =
      data.status === 'delivered' && !currentOrder.finishedAt
        ? new Date().toISOString()
        : currentOrder.finishedAt;

    const updatedOrder: ServiceOrder = {
      ...currentOrder,
      ...data,
      partsPrice: updatedPartsPrice,
      laborPrice: updatedLaborPrice,
      totalValue: updatedTotalValue,
      finishedAt,
      updatedAt: new Date().toISOString(),
    };

    orders[index] = updatedOrder;
    this.saveOrders(orders);

    if (data.status && data.status !== currentOrder.status) {
      const statusLabel = OS_STATUS_LABELS[data.status]?.label || data.status;
      activitiesService.log({
        type: 'os',
        title: `Status da ${updatedOrder.id} alterado`,
        description: `Novo status: ${statusLabel} (${updatedOrder.clientName})`,
        entityId: updatedOrder.id,
      });
    }

    return updatedOrder;
  }

  delete(id: string): boolean {
    const orders = this.getOrders();
    const filtered = orders.filter((o) => o.id !== id);
    if (filtered.length === orders.length) return false;
    this.saveOrders(filtered);
    return true;
  }

  generateWhatsAppLink(order: ServiceOrder): string {
    if (!order.clientPhone) return '#';
    const cleanPhone = order.clientPhone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

    const statusObj = OS_STATUS_LABELS[order.status];
    const statusLabel = statusObj ? statusObj.label : order.status;

    let message = `Olá *${order.clientName}*! 👋\n\n`;
    message += `Atualização sobre o conserto do seu *${order.deviceBrand} ${order.deviceModel}*:\n`;
    message += `📋 *Ordem de Serviço:* ${order.id}\n`;
    message += `🔄 *Status Atual:* ${statusLabel}\n`;

    if (order.status === 'budget_pending') {
      message += `💰 *Valor do Orçamento:* R$ ${order.totalValue.toFixed(2)}\n`;
      message += `Poderia confirmar a aprovação para iniciarmos o reparo?\n`;
    } else if (order.status === 'ready') {
      message += `✅ Seu aparelho está pronto e testado para retirada no balcão!\n`;
      message += `💵 *Total:* R$ ${order.totalValue.toFixed(2)} (${order.paymentStatus === 'paid' ? 'PAGO' : 'Pendente no balcão'})\n`;
    }

    message += `\nVocê pode acompanhar o status completo pelo link:\n`;
    message += `${window.location.origin}/status/${order.id}\n\n`;
    message += `Obrigado pela preferência! Cambuci Mobile - Assistência Técnica.`;

    return `https://api.whatsapp.com/send?phone=${phoneWithCountry}&text=${encodeURIComponent(message)}`;
  }
}

export const ordersService = new OrdersService();
