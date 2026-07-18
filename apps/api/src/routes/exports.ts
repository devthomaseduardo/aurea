import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getAdminFirestore } from '../lib/firebase.js';

export const exportsRouter = Router();

// All export routes require authentication
exportsRouter.use(requireAuth);

/**
 * GET /api/exports/proposal/:id
 * Returns raw proposal data for client-side PDF generation.
 * (Server-side PDF requires a headless lib like Puppeteer — add if needed)
 */
exportsRouter.get('/proposal/:id', async (req, res) => {
  try {
    const uid = (req as unknown as { uid: string }).uid;
    const { id } = req.params;

    const db = getAdminFirestore();
    const snap = await db.doc(`users/${uid}/proposals/${id}`).get();

    if (!snap.exists) {
      res.status(404).json({ error: 'Proposal not found' });
      return;
    }

    res.json({ data: { id: snap.id, ...snap.data() } });
  } catch (err) {
    console.error('[exports] Error fetching proposal:', err);
    res.status(500).json({ error: 'Failed to fetch proposal' });
  }
});

/**
 * GET /api/exports/client/:id
 * Returns raw client data for export.
 */
exportsRouter.get('/client/:id', async (req, res) => {
  try {
    const uid = (req as unknown as { uid: string }).uid;
    const { id } = req.params;

    const db = getAdminFirestore();
    const snap = await db.doc(`users/${uid}/clients/${id}`).get();

    if (!snap.exists) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    res.json({ data: { id: snap.id, ...snap.data() } });
  } catch (err) {
    console.error('[exports] Error fetching client:', err);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
});
