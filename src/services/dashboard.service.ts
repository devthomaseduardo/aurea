import { clientsService } from './clients.service';
import { proposalsService } from './proposals.service';
import { contractsService } from './contracts.service';
import type { DashboardMetrics } from '@/types/domain';

export const dashboardService = {
  getMetrics(): DashboardMetrics {
    const clients = clientsService.getAll();
    const proposals = proposalsService.getAll();
    const contracts = contractsService.getAll();

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
};
