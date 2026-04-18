// api/stripe-webhook.js
// Vercel serverless function — receives Stripe events and updates Supabase
// Events handled:
//   checkout.session.completed     → user paid → set Pro
//   invoice.payment_succeeded      → subscription renewed → keep Pro
//   customer.subscription.deleted  → cancelled → set Free
//   invoice.payment_failed         → payment failed → set Free

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Use service role key — bypasses RLS so we can write to subscriptions
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // Read raw body — required for Stripe signature verification
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

  try {
    switch (event.type) {

      // ── User completes checkout → upgrade to Pro ──────────────
      case 'checkout.session.completed': {
        const session = event.data.object;
        const email = session.customer_email || session.customer_details?.email;
        const stripeCustomerId = session.customer;
        const stripeSubscriptionId = session.subscription;

        if (email) {
          await setUserPlan(email, 'pro', stripeCustomerId, stripeSubscriptionId);
          console.log(`✅ Upgraded to Pro: ${email}`);
        }
        break;
      }

      // ── Subscription renewed → keep Pro ───────────────────────
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        // Only process subscription invoices (not one-off charges)
        if (invoice.subscription) {
          const customer = await stripe.customers.retrieve(invoice.customer);
          const email = customer.email;
          if (email) {
            // Get subscription details for period end
            const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
            await setUserPlan(
              email, 'pro',
              invoice.customer,
              invoice.subscription,
              subscription.current_period_end
            );
            console.log(`✅ Renewed Pro: ${email}`);
          }
        }
        break;
      }

      // ── Subscription cancelled → downgrade to Free ─────────────
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer);
        const email = customer.email;
        if (email) {
          await setUserPlan(email, 'free', subscription.customer, subscription.id);
          console.log(`⬇️ Downgraded to Free: ${email}`);
        }
        break;
      }

      // ── Payment failed → downgrade to Free ────────────────────
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        if (invoice.subscription) {
          const customer = await stripe.customers.retrieve(invoice.customer);
          const email = customer.email;
          if (email) {
            await setUserPlan(email, 'free', invoice.customer, invoice.subscription);
            console.log(`❌ Payment failed, downgraded: ${email}`);
          }
        }
        break;
      }

      default:
        console.log(`Ignored event: ${event.type}`);
    }
  } catch (err) {
    console.error('Error processing webhook:', err.message);
    // Still return 200 so Stripe doesn't retry — log the error
    return res.status(200).json({ received: true, error: err.message });
  }

  res.status(200).json({ received: true });
}

// ── Update user plan in BOTH user_metadata AND subscriptions table ─────────
async function setUserPlan(email, plan, stripeCustomerId, stripeSubscriptionId, periodEnd) {
  // 1. Find the Supabase user by email
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (listError) {
    console.error('Error listing users:', listError);
    throw listError;
  }

  const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
  if (!user) {
    console.error(`No Supabase user found for email: ${email}`);
    return; // Don't throw — user might not have signed up yet
  }

  // 2. Update user_metadata so JWT hook picks it up on next login
  const { error: metaError } = await supabase.auth.admin.updateUserById(
    user.id,
    { user_metadata: { ...user.user_metadata, plan } }
  );
  if (metaError) {
    console.error('Error updating user_metadata:', metaError);
    throw metaError;
  }

  // 3. Upsert subscriptions table for full audit trail
  const subscriptionData = {
    user_id: user.id,
    stripe_customer_id: stripeCustomerId || null,
    stripe_subscription_id: stripeSubscriptionId || null,
    plan,
    status: plan === 'pro' ? 'active' : 'inactive',
    updated_at: new Date().toISOString(),
  };

  if (periodEnd) {
    subscriptionData.current_period_end = new Date(periodEnd * 1000).toISOString();
  }

  const { error: subError } = await supabase
    .from('subscriptions')
    .upsert(subscriptionData, { onConflict: 'user_id' });

  if (subError) {
    console.error('Error upserting subscription:', subError);
    throw subError;
  }

  console.log(`Plan set to '${plan}' for user ${user.id} (${email})`);
}

// Required: disable Vercel body parser so we can read raw body for Stripe sig
export const config = {
  api: {
    bodyParser: false,
  },
};
