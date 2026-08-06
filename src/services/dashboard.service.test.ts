import { beforeEach, describe, expect, it } from 'vitest';
import { dashboardService } from './dashboard.service';
import { clientsService } from './clients.service';
import { ordersService } from './orders.service';
import { inventoryService } from './inventory.service';

describe('dashboardService', () => {
  beforeEach(() => {
    localStorage.clear();
    // force seed
    clientsService.getAll();
    ordersService.list();
    inventoryService.list();
  });

  it('retorna métricas numéricas coerentes da oficina', () => {
    const metrics = dashboardService.getMetrics();

    expect(metrics.clients).toBeGreaterThan(0);
    expect(metrics.revenue).toBeGreaterThanOrEqual(0);
    expect(metrics.activeOS).toBeGreaterThanOrEqual(0);
    expect(metrics.readyOS).toBeGreaterThanOrEqual(0);
    expect(metrics.lowStockItemsCount).toBeGreaterThanOrEqual(0);
  });

  it('retorna série de receita com 6 meses', () => {
    const series = dashboardService.getRevenueSeries();
    expect(series).toHaveLength(6);
    expect(series[0]).toHaveProperty('month');
    expect(series[0]).toHaveProperty('revenue');
    expect(series[0]).toHaveProperty('repair');
  });

  it('retorna breakdown de status de ordens de serviço', () => {
    const breakdown = dashboardService.getOSStatusBreakdown();
    expect(breakdown.length).toBe(7);
    expect(breakdown.every((b) => typeof b.count === 'number')).toBe(true);
  });
});
