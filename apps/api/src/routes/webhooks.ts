import { Router } from 'express';

export const webhooksRouter = Router();

/**
 * POST /api/webhooks/stripe
 * Stripe sends raw body — express.raw() is applied in server.ts for this path.
 *
 * To activate: set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in .env
 * and uncomment the Stripe import below.
 */
webhooksRouter.post('/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    res.status(400).json({ error: 'Missing stripe-signature header' });
    return;
  }

  // ── Uncomment after adding stripe to package.json ──────────────────
  // import Stripe from 'stripe';
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  // const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  //
  // let event: Stripe.Event;
  // try {
  //   event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  // } catch (err) {
  //   console.error('[webhook/stripe] Signature verification failed:', err);
  //   res.status(400).json({ error: 'Webhook signature mismatch' });
  //   return;
  // }
  //
  // switch (event.type) {
  //   case 'payment_intent.succeeded':
  //     // handle payment
  //     break;
  //   default:
  //     console.log(`[webhook/stripe] Unhandled event: ${event.type}`);
  // }
  // ────────────────────────────────────────────────────────────────────

  res.json({ received: true });
});
