import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getAdminAuth, getAdminFirestore } from '../lib/firebase.js';

export const adminRouter = Router();

// All admin routes require a verified Firebase token
adminRouter.use(requireAuth);

/**
 * GET /api/admin/me
 * Returns the Firebase Auth record for the authenticated user.
 */
adminRouter.get('/me', async (req, res) => {
  try {
    const uid = (req as unknown as { uid: string }).uid;
    const userRecord = await getAdminAuth().getUser(uid);
    res.json({
      data: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
        emailVerified: userRecord.emailVerified,
        createdAt: userRecord.metadata.creationTime,
        lastSignIn: userRecord.metadata.lastSignInTime,
        providerIds: userRecord.providerData.map((p) => p.providerId),
      },
    });
  } catch (err) {
    console.error('[admin] getUser error:', err);
    res.status(500).json({ error: 'Failed to fetch user record' });
  }
});

/**
 * DELETE /api/admin/account
 * Deletes the authenticated user's Firestore data and Auth account.
 * Used by the "Delete account" flow in Settings.
 */
adminRouter.delete('/account', async (req, res) => {
  try {
    const uid = (req as unknown as { uid: string }).uid;
    const db = getAdminFirestore();

    // Delete all subcollections
    const collections = ['proposals', 'clients', 'contracts', 'activities', 'profile'];
    await Promise.all(
      collections.map(async (col) => {
        const snap = await db.collection(`users/${uid}/${col}`).get();
        const batch = db.batch();
        snap.docs.forEach((d) => batch.delete(d.ref));
        if (snap.size > 0) await batch.commit();
      })
    );

    // Delete root user document
    await db.doc(`users/${uid}`).delete();

    // Delete Firebase Auth user
    await getAdminAuth().deleteUser(uid);

    res.json({ message: 'Account and all data deleted successfully' });
  } catch (err) {
    console.error('[admin] deleteAccount error:', err);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});
