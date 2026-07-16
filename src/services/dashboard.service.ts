import { clientsService } from './clients.service';
import { proposalsService } from './proposals.service';
import { contractsService } from './contracts.service';
import type { DashboardMetrics } from '@/types/domain';

function computeMetrics(
  clients: Awaited<ReturnType<typeof clientsService.getAllAsync>>,
  proposals: Awaited<ReturnType<typeof proposalsService.getAllAsync>>,
  contracts: Awaited<ReturnType<typeof contractsService.getAllAsync>>
): DashboardMetrics {
  const accepted = proposals.filter((p) => p.status === 'accepted');
  const sentLike = proposals.filter((p) =>
    ['sent', 'viewed', 'accepted', 'rejected'].includes(p.status)
  );

  const revenue = [
    ...accepted.map((p) => p.totalValue),
    ...contracts
      .filter((c) => c.status === 'active' || c.status === 'completed')
      .map((c) => c.totalValue),
  ].reduce((a, b) => a + b, 0);

  // Avoid double counting if proposal already accepted and has contract
  const uniqueRevenue =
    accepted.reduce((a, p) => a + p.totalValue, 0) +
    contracts
      .filter((c) => c.status === 'active' || c.status === 'completed')
      .filter((c) => !accepted.some((p) => p.id === c.proposalId))
      .reduce((a, c) => a + c.totalValue, 0);

  const hours = accepted.reduce((a, p) => a + p.totalHours, 0);
  const profit = uniqueRevenue * 0.72; // rough margin after tax/costs for display

  return {
    revenue: uniqueRevenue || revenue,
    clients: clients.filter((c) => c.status !== 'inactive').length,
    projects: accepted.length + contracts.filter((c) => c.status === 'active').length,
    hours,
    profit,
    pendingProposals: proposals.filter((p) =>
      ['draft', 'sent', 'viewed'].includes(p.status)
    ).length,
    activeContracts: contracts.filter((c) => c.status === 'active').length,
    acceptanceRate:
      sentLike.length === 0
        ? 0
        : Math.round((accepted.length / sentLike.length) * 100),
  };
}

export const dashboardService = {
  getMetrics(): DashboardMetrics {
    return computeMetrics(
      clientsService.getAll(),
      proposalsService.getAll(),
      contractsService.getAll()
    );
  },

  async getMetricsAsync(): Promise<DashboardMetrics> {
    const [clients, proposals, contracts] = await Promise.all([
      clientsService.getAllAsync(),
      proposalsService.getAllAsync(),
      contractsService.getAllAsync(),
    ]);
    return computeMetrics(clients, proposals, contracts);
  },

  getRevenueSeries() {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    const base = [8200, 12400, 9800, 15600, 11200, 18400];
    return months.map((month, i) => ({
      month,
      revenue: base[i],
      profit: Math.round(base[i] * 0.72),
    }));
  },

  getProposalStatusBreakdown() {
    const proposals = proposalsService.getAll();
    const statuses = ['draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired'] as const;
    return statuses.map((status) => ({
      status,
      count: proposals.filter((p) => p.status === status).length,
    }));
  },

  async getProposalStatusBreakdownAsync() {
    const proposals = await proposalsService.getAllAsync();
    const statuses = ['draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired'] as const;
    return statuses.map((status) => ({
      status,
      count: proposals.filter((p) => p.status === status).length,
    }));
  },
};
