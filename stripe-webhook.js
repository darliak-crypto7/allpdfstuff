// api/stripe-webhook.js
// Vercel serverless function — receives Stripe events and updates Supabase user plan
// Events handled:
//   checkout.session.completed     → user paid → set Pro
//   invoice.payment_succeeded      → subscription renewed → keep Pro
//   customer.subscription.deleted  → cancelled → set Free
//   invoice.payment_failed         → payment failed → set Free

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // service role key — bypasses RLS
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

      // ── User completes checkout → upgrade to Pro ──────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object;
        // client_reference_id = Supabase user ID (set by our handleSub function)
        const supabaseUserId = session.client_reference_id;
        const email = session.customer_email || session.customer_details?.email;

        if (supabaseUserId) {
          // Best case: upgrade directly by user ID (no email lookup needed)
          await setUserPlanById(supabaseUserId, 'pro');
          console.log(`✅ Upgraded to Pro by user ID: ${supabaseUserId}`);
        } else if (email) {
          // Fallback: find user by email
          await setUserPlanByEmail(email, 'pro');
          console.log(`✅ Upgraded to Pro by email: ${email}`);
        } else {
          console.error('checkout.session.completed: no user ID or email found');
        }
        break;
      }

      // ── Subscription renewed → keep Pro ──────────────────────────────────
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        // Only handle subscription invoices, not one-off charges
        if (!invoice.subscription) break;

        const customer = await stripe.customers.retrieve(invoice.customer);
        const email = customer.email;
        if (email) {
          await setUserPlanByEmail(email, 'pro');
          console.log(`✅ Renewed Pro: ${email}`);
        }
        break;
      }

      // ── Subscription cancelled → downgrade to Free ────────────────────────
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer);
        const email = customer.email;
        if (email) {
          await setUserPlanByEmail(email, 'free');
          console.log(`⬇️ Downgraded to Free (cancelled): ${email}`);
        }
        break;
      }

      // ── Payment failed → downgrade to Free ───────────────────────────────
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        if (!invoice.subscription) break;

        const customer = await stripe.customers.retrieve(invoice.customer);
        const email = customer.email;
        if (email) {
          await setUserPlanByEmail(email, 'free');
          console.log(`❌ Payment failed, downgraded: ${email}`);
        }
        break;
      }

      default:
        console.log(`Ignored event: ${event.type}`);
    }
  } catch (err) {
    console.error('Error processing webhook:', err.message);
    // Return 200 anyway so Stripe doesn't keep retrying
    return res.status(200).json({ received: true, error: err.message });
  }

  res.status(200).json({ received: true });
}

// ── Update plan directly by Supabase user ID (fastest, most reliable) ────────
async function setUserPlanById(userId, plan) {
  const { data: user, error: fetchError } = await supabase.auth.admin.getUserById(userId);
  if (fetchError || !user) {
    console.error(`Cannot find user by ID ${userId}:`, fetchError?.message);
    return;
  }

  const { error } = await supabase.auth.admin.updateUserById(
    userId,
    { user_metadata: { ...user.user_metadata, plan } }
  );
  if (error) console.error('Error updating plan by ID:', error.message);
  else console.log(`Plan set to '${plan}' for user ID ${userId}`);
}

// ── Update plan by email (fallback for renewal/cancellation events) ───────────
async function setUserPlanByEmail(email, plan) {
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (listError) {
    console.error('Error listing users:', listError.message);
    return;
  }

  const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
  if (!user) {
    console.error(`No Supabase user found for email: ${email}`);
    return;
  }

  const { error } = await supabase.auth.admin.updateUserById(
    user.id,
    { user_metadata: { ...user.user_metadata, plan } }
  );
  if (error) console.error('Error updating plan by email:', error.message);
  else console.log(`Plan set to '${plan}' for user ${user.id} (${email})`);
}

// ── Required: disable body parsing so Stripe signature verification works ─────
export const config = {
  api: {
    bodyParser: false,
  },
};
