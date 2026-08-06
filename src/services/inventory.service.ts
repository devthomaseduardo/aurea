import { InventoryItem } from '@/types/domain';
import { APP_CONFIG } from '@/core/config/app.config';

const STORAGE_KEY = `${APP_CONFIG.storagePrefix}_inventory`;

const DEFAULT_ITEMS: InventoryItem[] = [
  {
    id: 'PART-001',
    name: 'Tela Frontal iPhone 13 OLED Premium',
    category: 'parts',
    sku: 'TL-IP13-PRM',
    brand: 'Apple',
    compatibleModels: ['iPhone 13', 'iPhone 13 mini'],
    quantity: 6,
    minQuantity: 2,
    costPrice: 280,
    salePrice: 550,
    location: 'Gaveta A1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PART-002',
    name: 'Bateria Original Moto G60 6000mAh',
    category: 'parts',
    sku: 'BAT-MG60',
    brand: 'Motorola',
    compatibleModels: ['Moto G60', 'Moto G60s'],
    quantity: 8,
    minQuantity: 3,
    costPrice: 65,
    salePrice: 160,
    location: 'Gaveta B2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PART-003',
    name: 'Conector de Carga USB-C Samsung S21',
    category: 'parts',
    sku: 'CON-S21-USBC',
    brand: 'Samsung',
    compatibleModels: ['Galaxy S21', 'Galaxy S21 FE'],
    quantity: 1,
    minQuantity: 4,
    costPrice: 25,
    salePrice: 120,
    location: 'Gaveta A3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ACC-001',
    name: 'Película de Vidro 3D Cerâmica iPhone 13/14',
    category: 'accessories',
    sku: 'PEL-3D-IP13',
    brand: 'Baseus',
    quantity: 25,
    minQuantity: 5,
    costPrice: 8,
    salePrice: 35,
    location: 'Expositor 1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ACC-002',
    name: 'Carregador Rápido GaN 33W USB-C Dual',
    category: 'accessories',
    sku: 'CHG-33W-GAN',
    brand: 'Anker',
    quantity: 12,
    minQuantity: 4,
    costPrice: 45,
    salePrice: 110,
    location: 'Prateleira B',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'DEV-001',
    name: 'iPhone 12 128GB Azul (Seminovo 92% Bateria)',
    category: 'devices',
    sku: 'DEV-IP12-128-BLU',
    brand: 'Apple',
    quantity: 2,
    minQuantity: 1,
    costPrice: 1900,
    salePrice: 2690,
    location: 'Vitrine Principal',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

class InventoryService {
  private getItems(): InventoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ITEMS));
        return DEFAULT_ITEMS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_ITEMS;
    }
  }

  private saveItems(items: InventoryItem[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  list(): InventoryItem[] {
    return this.getItems();
  }

  getById(id: string): InventoryItem | undefined {
    return this.getItems().find((item) => item.id === id);
  }

  create(data: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): InventoryItem {
    const items = this.getItems();
    const prefix = data.category === 'parts' ? 'PART' : data.category === 'devices' ? 'DEV' : 'ACC';
    const newId = `${prefix}-${Date.now().toString().slice(-4)}`;

    const newItem: InventoryItem = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    items.unshift(newItem);
    this.saveItems(items);
    return newItem;
  }

  update(id: string, data: Partial<Omit<InventoryItem, 'id' | 'createdAt'>>): InventoryItem | undefined {
    const items = this.getItems();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return undefined;

    const updatedItem: InventoryItem = {
      ...items[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    items[index] = updatedItem;
    this.saveItems(items);
    return updatedItem;
  }

  delete(id: string): boolean {
    const items = this.getItems();
    const filtered = items.filter((i) => i.id !== id);
    if (filtered.length === items.length) return false;
    this.saveItems(filtered);
    return true;
  }

  deductStock(id: string, quantity: number): boolean {
    const item = this.getById(id);
    if (!item || item.quantity < quantity) return false;

    this.update(id, { quantity: item.quantity - quantity });
    return true;
  }

  getLowStockItems(): InventoryItem[] {
    return this.getItems().filter((item) => item.quantity <= item.minQuantity);
  }
}

export const inventoryService = new InventoryService();
