import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'aurea-api',
    version: process.env.npm_package_version ?? '1.0.0',
    env: process.env.NODE_ENV ?? 'development',
    timestamp: new Date().toISOString(),
  });
});
