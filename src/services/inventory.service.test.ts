import { describe, expect, it, beforeEach } from 'vitest';
import { inventoryService } from './inventory.service';

describe('InventoryService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('lista itens do estoque padrão', () => {
    const list = inventoryService.list();
    expect(list.length).toBeGreaterThan(0);
  });

  it('cria novo item e faz dedução de estoque', () => {
    const created = inventoryService.create({
      name: 'Bateria iPhone 11',
      category: 'parts',
      sku: 'BAT-IP11',
      brand: 'Apple',
      quantity: 10,
      minQuantity: 2,
      costPrice: 80,
      salePrice: 180,
    });

    expect(created.id).toBeDefined();

    const deducted = inventoryService.deductStock(created.id, 3);
    expect(deducted).toBe(true);

    const updated = inventoryService.getById(created.id);
    expect(updated?.quantity).toBe(7);
  });
});
