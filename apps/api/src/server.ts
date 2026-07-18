import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { router } from './routes/index.js';

export function createServer() {
  const app = express();

  // ── Security ──────────────────────────────────────────────────
  app.use(helmet());

  // ── CORS ──────────────────────────────────────────────────────
  const allowedOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim());

  app.use(
    cors({
      origin: (origin, cb) => {
        // allow server-to-server (no origin) and listed origins
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        cb(new Error(`CORS: origin ${origin} not allowed`));
      },
      credentials: true,
    })
  );

  // ── Logging ───────────────────────────────────────────────────
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  // ── Body parsing ──────────────────────────────────────────────
  // Raw body for Stripe webhook signature verification
  app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));

  // ── Routes ────────────────────────────────────────────────────
  app.use('/api', router);

  // ── 404 ───────────────────────────────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // ── Error handler ─────────────────────────────────────────────
  app.use(
    (
      err: Error,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      console.error('[api] Unhandled error:', err);
      res.status(500).json({
        error:
          process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
      });
    }
  );

  return app;
}
