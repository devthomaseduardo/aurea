import type { RequestHandler } from 'express';
import { getAdminAuth } from '../lib/firebase.js';

/**
 * Middleware: verifica o Firebase ID token no header Authorization.
 * Injeta uid e email tipados no request do Express.
 */
export const requireAuth: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }

  const idToken = authHeader.slice(7).trim();
  if (!idToken) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }

  try {
    const decoded = await getAdminAuth().verifyIdToken(idToken);
    req.uid = decoded.uid;
    req.email = decoded.email;
    next();
  } catch (err: unknown) {
    console.error('[auth] Token verification failed:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
