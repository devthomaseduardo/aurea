import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getAdminFirestore } from '../lib/firebase.js';

export const analyticsRouter = Router();

analyticsRouter.use(requireAuth);

const OPEN_PROPOSAL_STATUSES = new Set(['draft', 'sent', 'viewed']);
const ACTIVE_CONTRACT_STATUSES = new Set(['active', 'completed']);

function toMillis(value: unknown): number {
  if (!value) return 0;
  if (typeof value === 'string') return Date.parse(value) || 0;
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'object' && value !== null && 'toDate' in value) {
    const maybeTimestamp = value as { toDate?: () => Date };
    return maybeTimestamp.toDate?.().getTime() ?? 0;
  }
  return 0;
}

function ageInDays(value: unknown): number {
  const timestamp = toMillis(value);
  if (!timestamp) return 0;
  return Math.max(0, Math.floor((Date.now() - timestamp) / 86_400_000));
}

/**
 * GET /api/analytics/dashboard
 * Server-side aggregation of KPIs for the authenticated user.
 */
analyticsRouter.get('/dashboard', async (req, res) => {
  try {
    const uid = (req as unknown as { uid: string }).uid;
    const db = getAdminFirestore();

    const [proposalsSnap, clientsSnap, contractsSnap] = await Promise.all([
      db.collection(`users/${uid}/proposals`).get(),
      db.collection(`users/${uid}/clients`).get(),
      db.collection(`users/${uid}/contracts`).get(),
    ]);

    const proposals = proposalsSnap.docs.map((d) => d.data());
    const clients = clientsSnap.docs.map((d) => d.data());
    const contracts = contractsSnap.docs.map((d) => d.data());

    const accepted = proposals.filter((p) => p.status === 'accepted');
    const decided = proposals.filter((p) => ['accepted', 'rejected'].includes(String(p.status)));
    const open = proposals.filter((p) => OPEN_PROPOSAL_STATUSES.has(String(p.status)));
    const activeContracts = contracts.filter((c) => ACTIVE_CONTRACT_STATUSES.has(String(c.status)));

    const totalRevenue = activeContracts.reduce(
      (sum, contract) => sum + (Number(contract.totalValue) || 0),
      0
    );
    const pipelineValue = open.reduce(
      (sum, proposal) => sum + (Number(proposal.totalValue) || 0),
      0
    );
    const conversionRate =
      decided.length > 0 ? Math.round((accepted.length / decided.length) * 100) : 0;

    res.json({
      data: {
        totalRevenue,
        pipelineValue,
        acceptedProposals: accepted.length,
        pendingProposals: open.length,
        totalProposals: proposals.length,
        activeClients: clients.filter((client) => client.status !== 'inactive').length,
        activeContracts: activeContracts.length,
        conversionRate,
      },
    });
  } catch (err) {
    console.error('[analytics] Dashboard error:', err);
    res.status(500).json({ error: 'Failed to compute dashboard stats' });
  }
});

/**
 * GET /api/analytics/pipeline
 * Breakdown of proposal statuses.
 */
analyticsRouter.get('/pipeline', async (req, res) => {
  try {
    const uid = (req as unknown as { uid: string }).uid;
    const db = getAdminFirestore();

    const snap = await db.collection(`users/${uid}/proposals`).get();
    const proposals = snap.docs.map((d) => d.data());

    const pipeline: Record<string, { count: number; value: number }> = {};
    for (const proposal of proposals) {
      const status = String(proposal.status ?? 'draft');
      if (!pipeline[status]) pipeline[status] = { count: 0, value: 0 };
      pipeline[status].count++;
      pipeline[status].value += Number(proposal.totalValue) || 0;
    }

    res.json({ data: pipeline });
  } catch (err) {
    console.error('[analytics] Pipeline error:', err);
    res.status(500).json({ error: 'Failed to compute pipeline' });
  }
});

/**
 * GET /api/analytics/workspace
 * Action-oriented commercial overview used by the portal home.
 */
analyticsRouter.get('/workspace', async (req, res) => {
  try {
    const uid = (req as unknown as { uid: string }).uid;
    const db = getAdminFirestore();

    const [proposalsSnap, contractsSnap, clientsSnap] = await Promise.all([
      db.collection(`users/${uid}/proposals`).get(),
      db.collection(`users/${uid}/contracts`).get(),
      db.collection(`users/${uid}/clients`).get(),
    ]);

    const proposals = proposalsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const contracts = contractsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const clients = clientsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const actions: Array<{
      id: string;
      type: 'proposal' | 'contract' | 'client';
      priority: 'high' | 'medium' | 'low';
      title: string;
      description: string;
      entityId: string;
      ageDays: number;
    }> = [];

    for (const proposal of proposals) {
      const status = String(proposal.status ?? 'draft');
      const referenceDate = proposal.sentAt ?? proposal.updatedAt ?? proposal.createdAt;
      const days = ageInDays(referenceDate);

      if (status === 'viewed' && days >= 1) {
        actions.push({
          id: `proposal-viewed-${proposal.id}`,
          type: 'proposal',
          priority: days >= 3 ? 'high' : 'medium',
          title: String(proposal.title ?? 'Proposta visualizada'),
          description: `Cliente visualizou a proposta há ${days} dia${days === 1 ? '' : 's'}. Faça um follow-up.`,
          entityId: proposal.id,
          ageDays: days,
        });
      } else if (status === 'sent' && days >= 2) {
        actions.push({
          id: `proposal-sent-${proposal.id}`,
          type: 'proposal',
          priority: days >= 5 ? 'high' : 'medium',
          title: String(proposal.title ?? 'Proposta enviada'),
          description: `Sem atualização há ${days} dias. Confirme o recebimento com o cliente.`,
          entityId: proposal.id,
          ageDays: days,
        });
      } else if (status === 'draft' && days >= 3) {
        actions.push({
          id: `proposal-draft-${proposal.id}`,
          type: 'proposal',
          priority: 'low',
          title: String(proposal.title ?? 'Proposta em rascunho'),
          description: `Rascunho parado há ${days} dias. Revise e decida se ainda faz sentido enviar.`,
          entityId: proposal.id,
          ageDays: days,
        });
      }
    }

    for (const contract of contracts) {
      const status = String(contract.status ?? 'draft');
      const days = ageInDays(contract.updatedAt ?? contract.createdAt);
      if (status === 'pending_signature') {
        actions.push({
          id: `contract-signature-${contract.id}`,
          type: 'contract',
          priority: days >= 3 ? 'high' : 'medium',
          title: String(contract.title ?? 'Contrato aguardando assinatura'),
          description: `Assinatura pendente há ${days} dia${days === 1 ? '' : 's'}.`,
          entityId: contract.id,
          ageDays: days,
        });
      }
    }

    for (const client of clients) {
      const days = ageInDays(client.updatedAt ?? client.createdAt);
      if (client.status === 'lead' && days >= 7) {
        actions.push({
          id: `client-lead-${client.id}`,
          type: 'client',
          priority: 'low',
          title: String(client.name ?? 'Lead sem avanço'),
          description: `Lead sem atualização há ${days} dias.`,
          entityId: client.id,
          ageDays: days,
        });
      }
    }

    const priorityWeight = { high: 3, medium: 2, low: 1 } as const;
    actions.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority] || b.ageDays - a.ageDays);

    const stages = ['draft', 'sent', 'viewed', 'accepted'] as const;
    const pipeline = stages.map((status) => {
      const items = proposals.filter((proposal) => proposal.status === status);
      return {
        status,
        count: items.length,
        value: items.reduce((sum, proposal) => sum + (Number(proposal.totalValue) || 0), 0),
      };
    });

    res.json({
      data: {
        actions: actions.slice(0, 8),
        pipeline,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('[analytics] Workspace error:', err);
    res.status(500).json({ error: 'Failed to compute workspace overview' });
  }
});
