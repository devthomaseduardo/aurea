import { Sale, SaleItem, PaymentMethod } from '@/types/domain';
import { APP_CONFIG } from '@/core/config/app.config';
import { inventoryService } from './inventory.service';
import { activitiesService } from './activities.service';

const STORAGE_KEY = `${APP_CONFIG.storagePrefix}_sales`;

const DEFAULT_SALES: Sale[] = [
  {
    id: 'VENDA-2026-001',
    clientName: 'Cliente Balcão',
    items: [
      {
        itemId: 'ACC-001',
        name: 'Película de Vidro 3D Cerâmica iPhone 13/14',
        quantity: 2,
        unitPrice: 35,
        totalPrice: 70,
      },
      {
        itemId: 'ACC-002',
        name: 'Carregador Rápido GaN 33W USB-C Dual',
        quantity: 1,
        unitPrice: 110,
        totalPrice: 110,
      },
    ],
    subtotal: 180,
    discount: 10,
    totalValue: 170,
    paymentMethod: 'pix',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'VENDA-2026-002',
    clientName: 'Fernanda Lima',
    items: [
      {
        itemId: 'DEV-001',
        name: 'iPhone 12 128GB Azul (Seminovo 92% Bateria)',
        quantity: 1,
        unitPrice: 2690,
        totalPrice: 2690,
      },
    ],
    subtotal: 2690,
    discount: 90,
    totalValue: 2600,
    paymentMethod: 'credit_card',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  pix: 'PIX',
  credit_card: 'Cartão de Crédito',
  debit_card: 'Cartão de Débito',
  cash: 'Dinheiro',
};

class SalesService {
  private getSales(): Sale[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SALES));
        return DEFAULT_SALES;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_SALES;
    }
  }

  private saveSales(sales: Sale[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
  }

  list(): Sale[] {
    return this.getSales().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  registerSale(data: {
    clientId?: string;
    clientName?: string;
    items: SaleItem[];
    discount?: number;
    paymentMethod: PaymentMethod;
    notes?: string;
  }): Sale {
    const sales = this.getSales();
    const count = sales.length + 1;
    const year = new Date().getFullYear();
    const id = `VENDA-${year}-${String(count).padStart(3, '0')}`;

    const subtotal = data.items.reduce((acc, i) => acc + i.totalPrice, 0);
    const discount = data.discount || 0;
    const totalValue = Math.max(0, subtotal - discount);

    const newSale: Sale = {
      id,
      clientId: data.clientId,
      clientName: data.clientName || 'Cliente Balcão',
      items: data.items,
      subtotal,
      discount,
      totalValue,
      paymentMethod: data.paymentMethod,
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };

    // Deduct inventory items
    newSale.items.forEach((item) => {
      if (item.itemId) {
        inventoryService.deductStock(item.itemId, item.quantity);
      }
    });

    sales.unshift(newSale);
    this.saveSales(sales);

    activitiesService.log({
      type: 'sale',
      title: `Venda no Balcão: ${newSale.id}`,
      description: `Valor: R$ ${newSale.totalValue.toFixed(2)} (${PAYMENT_METHOD_LABELS[newSale.paymentMethod]}) - ${newSale.clientName}`,
      entityId: newSale.id,
    });

    return newSale;
  }
}

export const salesService = new SalesService();
