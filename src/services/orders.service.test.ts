import { describe, expect, it, beforeEach } from 'vitest';
import { ordersService } from './orders.service';

describe('OrdersService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('lista as ordens de serviço padrão com sucesso', () => {
    const list = ordersService.list();
    expect(list.length).toBeGreaterThan(0);
    expect(list[0]).toHaveProperty('id');
    expect(list[0]).toHaveProperty('reportedIssue');
  });

  it('cria uma nova ordem de serviço com cálculo automático de total', () => {
    const newOrder = ordersService.create({
      clientId: 'cli-999',
      clientName: 'João Teste',
      clientPhone: '(11) 99999-8888',
      deviceType: 'phone',
      deviceBrand: 'Apple',
      deviceModel: 'iPhone 13',
      reportedIssue: 'Tela quebrada',
      status: 'received',
      laborPrice: 150,
      partsPrice: 300,
      totalValue: 450,
      paymentStatus: 'pending',
      warrantyDays: 90,
      partsUsed: [
        {
          id: 'p-1',
          name: 'Tela OLED iPhone 13',
          quantity: 1,
          unitPrice: 300,
        },
      ],
    });

    expect(newOrder.id).toContain('CM-');
    expect(newOrder.totalValue).toBe(450);

    const fetched = ordersService.getById(newOrder.id);
    expect(fetched).toBeDefined();
    expect(fetched?.clientName).toBe('João Teste');
  });

  it('atualiza o status de uma ordem de serviço', () => {
    const list = ordersService.list();
    const target = list[0];

    const updated = ordersService.update(target.id, { status: 'ready' });
    expect(updated?.status).toBe('ready');
  });

  it('pesquisa ordem por código ou telefone', () => {
    const results = ordersService.getByPhoneOrCode('CM-2026-00128');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe('CM-2026-00128');
  });
});
