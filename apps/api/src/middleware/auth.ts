import type { RequestHandler } from 'express';
import { getAdminAuth } from '../lib/firebase.js';

export interface AuthenticatedRequest extends Express.Request {
  uid: string;
  email?: string;
}

/**
 * Middleware: verifica o Firebase ID token no header Authorization.
 * Injeta req.uid e req.email no request.
 */
export const requireAuth: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }

  const idToken = authHeader.slice(7);

  try {
    const decoded = await getAdminAuth().verifyIdToken(idToken);
    // Attach to request
    (req as unknown as { uid: string; email?: string }).uid = decoded.uid;
    (req as unknown as { uid: string; email?: string }).email = decoded.email;
    next();
  } catch (err) {
    console.error('[auth] Token verification failed:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
