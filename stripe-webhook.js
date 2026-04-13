// api/stripe-webhook.js
// Vercel serverless function — receives Stripe events and updates Supabase

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // ── Read raw body (required for Stripe signature verification) ────────────
  const rawBody = await new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Stripe event received:', event.type);

  // ── Handle Stripe events ──────────────────────────────────────────────────

  switch (event.type) {

    // Customer subscribes → upgrade to Pro
    case 'checkout.session.completed':
    case 'invoice.payment_succeeded': {
      const obj = event.data.object;
      const email = obj.customer_email || obj.customer_details?.email;

      if (email) {
        await setUserPlan(email, 'pro');
        console.log(`Upgraded to Pro: ${email}`);
      }
      break;
    }

    // Subscription cancelled or payment failed → downgrade to free
    case 'customer.subscription.deleted':
    case 'invoice.payment_failed': {
      const obj = event.data.object;
      const customer = await stripe.customers.retrieve(obj.customer);
      const email = customer.email;

      if (email) {
        await setUserPlan(email, 'free');
        console.log(`Downgraded to Free: ${email}`);
      }
      break;
    }

    default:
      console.log(`Ignored event: ${event.type}`);
      break;
  }

  res.status(200).json({ received: true });
}

// ── Helper: update plan in Supabase user metadata ─────────────────────────
async function setUserPlan(email, plan) {
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.error('Error listing users:', listError);
    return;
  }

  const user = users.find(u => u.email === email);

  if (!user) {
    console.error(`No Supabase user found for: ${email}`);
    return;
  }

  const { error: updateError } = await supabase.auth.admin.updateUserById(
    user.id,
    { user_metadata: { ...user.user_metadata, plan } }
  );

  if (updateError) {
    console.error('Error updating user plan:', updateError);
  } else {
    console.log(`Set plan=${plan} for ${email}`);
  }
}

// ── Required: disable body parser so we read raw body above ───────────────
export const config = {
  api: {
    bodyParser: false,
  },
};
