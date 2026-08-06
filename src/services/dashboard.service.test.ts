import { describe, expect, it } from 'vitest';
import { dashboardService } from './dashboard.service';

describe('dashboardService', () => {
  it('retorna métricas calculadas corretamente', () => {
    const metrics = dashboardService.getMetrics();
    expect(metrics).toHaveProperty('revenue');
    expect(metrics).toHaveProperty('activeOS');
    expect(metrics).toHaveProperty('readyOS');
    expect(metrics).toHaveProperty('lowStockItemsCount');
  });

  it('retorna a série temporal de faturamento', () => {
    const series = dashboardService.getRevenueSeries();
    expect(series.length).toBe(6);
    expect(series[0]).toHaveProperty('repair');
    expect(series[0]).toHaveProperty('sales');
  });

  it('retorna breakdown de status de ordens de serviço', () => {
    const breakdown = dashboardService.getOSStatusBreakdown();
    expect(breakdown.length).toBe(8);
    expect(breakdown.every((b) => typeof b.count === 'number')).toBe(true);
  });
});
