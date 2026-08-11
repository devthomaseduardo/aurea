import { describe, expect, it } from 'vitest';
import { dashboardService } from './dashboard.service';

describe('dashboardService', () => {
  it('retorna métricas calculadas corretamente', () => {
    const metrics = dashboardService.getMetrics();
    expect(metrics).toHaveProperty('revenue');
    expect(metrics).toHaveProperty('projects');
    expect(metrics).toHaveProperty('acceptanceRate');
    expect(metrics).toHaveProperty('pendingProposals');
  });

  it('retorna a série temporal de faturamento', () => {
    const series = dashboardService.getRevenueSeries();
    expect(series.length).toBe(6);
    expect(series[0]).toHaveProperty('month');
    expect(series[0]).toHaveProperty('revenue');
    expect(series[0]).toHaveProperty('profit');
  });

  it('retorna pipeline de propostas', () => {
    const pipeline = dashboardService.getPipeline();
    expect(pipeline.length).toBe(4); // draft, sent, viewed, accepted
    expect(pipeline.every((p) => typeof p.count === 'number')).toBe(true);
  });
});
