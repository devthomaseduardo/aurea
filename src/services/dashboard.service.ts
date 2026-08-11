import { clientsService } from './clients.service';
import { proposalsService } from './proposals.service';
import { contractsService } from './contracts.service';
import type { DashboardMetrics, ProposalStatus } from '@/types/domain';

export type DashboardAction = {
  id: string;
  type: 'proposal' | 'contract' | 'client';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  entityId: string;
  href: string;
  ageDays: number;
};

export type PipelineStage = {
  status: ProposalStatus;
  label: string;
  count: number;
  value: number;
};

function daysSince(value?: string): number {
  if (!value) return 0;
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return 0;
  return Math.max(0, Math.floor((Date.now() - timestamp) / 86_400_000));
}

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

function buildRevenueSeries() {
  const contracts = contractsService.getAll();
  const formatter = new Intl.DateTimeFormat('pt-BR', { month: 'short' });
  const now = new Date();

  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    const month = date.getMonth();
    const year = date.getFullYear();

    const revenue = contracts
      .filter((contract) => {
        if (!['active', 'completed'].includes(contract.status)) return false;
        const reference = new Date(contract.startDate || contract.createdAt || contract.updatedAt);
        return reference.getFullYear() === year && reference.getMonth() === month;
      })
      .reduce((total, contract) => total + contract.totalValue, 0);

    return {
      month: formatter.format(date).replace('.', ''),
      revenue,
      profit: Math.round(revenue * 0.7),
    };
  });
}

function buildNextActions(): DashboardAction[] {
  const proposals = proposalsService.getAll();
  const contracts = contractsService.getAll();
  const clients = clientsService.getAll();
  const actions: DashboardAction[] = [];

  proposals.forEach((proposal) => {
    const ageDays = daysSince(proposal.sentAt || proposal.updatedAt || proposal.createdAt);
    if (proposal.status === 'viewed' && ageDays >= 1) {
      actions.push({
        id: `proposal-viewed-${proposal.id}`,
        type: 'proposal',
        priority: ageDays >= 3 ? 'high' : 'medium',
        title: proposal.title,
        description: `Visualizada há ${ageDays} dia${ageDays === 1 ? '' : 's'}. Faça um follow-up.`,
        entityId: proposal.id,
        href: `/app/proposals/${proposal.id}`,
        ageDays,
      });
    } else if (proposal.status === 'sent' && ageDays >= 2) {
      actions.push({
        id: `proposal-sent-${proposal.id}`,
        type: 'proposal',
        priority: ageDays >= 5 ? 'high' : 'medium',
        title: proposal.title,
        description: `Enviada há ${ageDays} dias sem atualização. Confirme o recebimento.`,
        entityId: proposal.id,
        href: `/app/proposals/${proposal.id}`,
        ageDays,
      });
    } else if (proposal.status === 'draft' && ageDays >= 3) {
      actions.push({
        id: `proposal-draft-${proposal.id}`,
        type: 'proposal',
        priority: 'low',
        title: proposal.title,
        description: `Rascunho parado há ${ageDays} dias. Revise antes de perder o timing.`,
        entityId: proposal.id,
        href: `/app/proposals/${proposal.id}`,
        ageDays,
      });
    }
  });

  contracts.forEach((contract) => {
    const ageDays = daysSince(contract.updatedAt || contract.createdAt);
    if (contract.status === 'pending_signature') {
      actions.push({
        id: `contract-signature-${contract.id}`,
        type: 'contract',
        priority: ageDays >= 3 ? 'high' : 'medium',
        title: contract.title,
        description: `Contrato aguardando assinatura há ${ageDays} dia${ageDays === 1 ? '' : 's'}.`,
        entityId: contract.id,
        href: '/app/contracts',
        ageDays,
      });
    }
  });

  clients.forEach((client) => {
    const ageDays = daysSince(client.updatedAt || client.createdAt);
    if (client.status === 'lead' && ageDays >= 7) {
      actions.push({
        id: `lead-${client.id}`,
        type: 'client',
        priority: 'low',
        title: client.name,
        description: `Lead sem atualização há ${ageDays} dias.`,
        entityId: client.id,
        href: `/app/clients/${client.id}`,
        ageDays,
      });
    }
  });

  const priorityWeight = { high: 3, medium: 2, low: 1 } as const;
  return actions
    .sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority] || b.ageDays - a.ageDays)
    .slice(0, 8);
}

function buildPipeline(): PipelineStage[] {
  const proposals = proposalsService.getAll();
  const stages: Array<{ status: ProposalStatus; label: string }> = [
    { status: 'draft', label: 'Preparação' },
    { status: 'sent', label: 'Enviadas' },
    { status: 'viewed', label: 'Negociação' },
    { status: 'accepted', label: 'Aceitas' },
  ];

  return stages.map(({ status, label }) => {
    const items = proposals.filter((proposal) => proposal.status === status);
    return {
      status,
      label,
      count: items.length,
      value: items.reduce((total, proposal) => total + proposal.totalValue, 0),
    };
  });
}

export const dashboardService = {
  getMetrics(): DashboardMetrics {
    return computeMetrics();
  },

  async getMetricsAsync(): Promise<DashboardMetrics> {
    return computeMetrics();
  },

  getRevenueSeries() {
    return buildRevenueSeries();
  },

  getNextActions() {
    return buildNextActions();
  },

  getPipeline() {
    return buildPipeline();
  },
};
