// ============================================================
// stripe-webhook.js — Vercel Serverless Function (ESM)
// Fixed: ESM format, raw body for Stripe signature verification
// ============================================================

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// CRITICAL: Disable Vercel's default body parsing so we get the raw body
// needed for Stripe signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to read the raw request body as a buffer
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const sig = req.headers['stripe-signature'];

  if (!sig) {
    console.error('Missing stripe-signature header');
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  let event;

  try {
    // Get raw body — required for Stripe signature verification
    const rawBody = await getRawBody(req);

    // Verify the event with Stripe
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the Stripe event types
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      console.log('Payment successful, session ID:', session.id);
      // TODO: Fulfil order, unlock access, send confirmation email etc.
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      console.log('PaymentIntent succeeded:', paymentIntent.id);
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      console.error('PaymentIntent failed:', paymentIntent.id);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      console.log('Subscription cancelled:', subscription.id);
      // TODO: Revoke access for the user
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Always return 200 to acknowledge receipt of the event
  return res.status(200).json({ received: true });
}
