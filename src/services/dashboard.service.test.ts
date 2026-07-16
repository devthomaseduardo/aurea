import { beforeEach, describe, expect, it } from 'vitest';
import { dashboardService } from './dashboard.service';
import { clientsService } from './clients.service';
import { proposalsService } from './proposals.service';
import { contractsService } from './contracts.service';

describe('dashboardService', () => {
  beforeEach(() => {
    localStorage.clear();
    // force seed
    clientsService.getAll();
    proposalsService.getAll();
    contractsService.getAll();
  });

  it('retorna métricas numéricas coerentes', () => {
    const metrics = dashboardService.getMetrics();

    expect(metrics.clients).toBeGreaterThan(0);
    expect(metrics.revenue).toBeGreaterThanOrEqual(0);
    expect(metrics.profit).toBeGreaterThanOrEqual(0);
    expect(metrics.acceptanceRate).toBeGreaterThanOrEqual(0);
    expect(metrics.acceptanceRate).toBeLessThanOrEqual(100);
    expect(metrics.pendingProposals).toBeGreaterThanOrEqual(0);
    expect(metrics.activeContracts).toBeGreaterThanOrEqual(0);
  });

  it('retorna série de receita com 6 meses', () => {
    const series = dashboardService.getRevenueSeries();
    expect(series).toHaveLength(6);
    expect(series[0]).toHaveProperty('month');
    expect(series[0]).toHaveProperty('revenue');
    expect(series[0]).toHaveProperty('profit');
  });

  it('retorna breakdown de status de propostas', () => {
    const breakdown = dashboardService.getProposalStatusBreakdown();
    expect(breakdown.length).toBe(6);
    expect(breakdown.every((b) => typeof b.count === 'number')).toBe(true);
  });
});
