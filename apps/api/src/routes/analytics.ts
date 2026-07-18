import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getAdminFirestore } from '../lib/firebase.js';

export const analyticsRouter = Router();

analyticsRouter.use(requireAuth);

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
    const contracts = contractsSnap.docs.map((d) => d.data());

    const accepted = proposals.filter((p) => p.status === 'accepted');
    const totalRevenue = accepted.reduce(
      (sum, p) => sum + (Number(p.totalValue) || 0),
      0
    );
    const conversionRate =
      proposals.length > 0
        ? Math.round((accepted.length / proposals.length) * 100)
        : 0;

    const activeContracts = contracts.filter(
      (c) => c.status === 'signed' || c.status === 'sent'
    ).length;

    res.json({
      data: {
        totalRevenue,
        acceptedProposals: accepted.length,
        totalProposals: proposals.length,
        activeClients: clientsSnap.size,
        activeContracts,
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
    for (const p of proposals) {
      const status = String(p.status ?? 'draft');
      if (!pipeline[status]) pipeline[status] = { count: 0, value: 0 };
      pipeline[status].count++;
      pipeline[status].value += Number(p.totalValue) || 0;
    }

    res.json({ data: pipeline });
  } catch (err) {
    console.error('[analytics] Pipeline error:', err);
    res.status(500).json({ error: 'Failed to compute pipeline' });
  }
});
