import { Router } from 'express';
import { healthRouter } from './health.js';
import { exportsRouter } from './exports.js';
import { analyticsRouter } from './analytics.js';
import { webhooksRouter } from './webhooks.js';
import { adminRouter } from './admin.js';

export const router = Router();

router.use('/health', healthRouter);
router.use('/exports', exportsRouter);
router.use('/analytics', analyticsRouter);
router.use('/webhooks', webhooksRouter);
router.use('/admin', adminRouter);
