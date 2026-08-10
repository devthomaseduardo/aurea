import { clientsService } from './clients.service';
import { proposalsService } from './proposals.service';
import { contractsService } from './contracts.service';
import type { DashboardMetrics } from '@/types/domain';

function computeMetrics(): DashboardMetrics {
  const clients = clientsService.getAll();
  const proposals = proposalsService.getAll();
  const contracts = contractsService.getAll();

  const acceptedProposals = proposals.filter((proposal) => proposal.status === 'accepted');
  const decidedProposals = proposals.filter((proposal) =>
    ['accepted', 'rejected'].includes(proposal.status)
  );
  const openProposals = proposals.filter((proposal) =>
    ['draft', 'sent', 'viewed'].includes(proposal.status)
  );
  const activeContracts = contracts.filter((contract) =>
    ['active', 'completed'].includes(contract.status)
  );

  const revenue = activeContracts.reduce((total, contract) => total + contract.totalValue, 0);
  const proposalPipeline = openProposals.reduce(
    (total, proposal) => total + proposal.totalValue,
    0
  );
  const acceptanceRate =
    decidedProposals.length > 0
      ? Math.round((acceptedProposals.length / decidedProposals.length) * 100)
      : 0;

  return {
    revenue,
    repairRevenue: 0,
    salesRevenue: proposalPipeline,
    clients: clients.filter((client) => client.status !== 'inactive').length,
    activeOS: activeContracts.length,
    completedOS: contracts.filter((contract) => contract.status === 'completed').length,
    readyOS: 0,
    pendingBudgets: openProposals.length,
    lowStockItemsCount: 0,
    averageTicket:
      activeContracts.length > 0 ? Math.round(revenue / activeContracts.length) : 0,
    hours: acceptedProposals.reduce((total, proposal) => total + proposal.totalHours, 0),
    projects: activeContracts.length,
    profit: Math.round(revenue * 0.7),
    acceptanceRate,
    pendingProposals: openProposals.length,
  };
}

export const dashboardService = {
  getMetrics(): DashboardMetrics {
    return computeMetrics();
  },

  async getMetricsAsync(): Promise<DashboardMetrics> {
    return computeMetrics();
  },

  getRevenueSeries() {
    const months = ['Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'];
    const revenue = [12800, 16400, 19200, 23800, 27100, 31900];

    return months.map((month, index) => ({
      month,
      revenue: revenue[index],
      profit: Math.round(revenue[index] * 0.7),
    }));
  },
};
