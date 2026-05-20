# AllPDFStuff.com — Session Handoff
**Date:** May 20, 2026 | **Site:** https://www.allpdfstuff.com

---

## ACCOUNTS & KEYS
| Service | Detail |
|---|---|
| GitHub | darliak-crypto7/allpdfstuff |
| Vercel | Auto-deploys on GitHub commit |
| Supabase | pzimfguaqqcktokwwdeq |
| Stripe Live Key | pk_live_51TBygSJEuTHMKBHAkY5CekZDzRCpWHy16X8jJ1FPGHimrLwFxNnKxjt7tB6RtOgGT6WdEEw7uXhopoO0oI85D7AK00M2ZM839H |
| Stripe Payment Link | https://buy.stripe.com/4gM00kf9Igxo2798NX1ck00 |
| iLovePDF Public Key | project_public_c3a9e8f2fc9c20c33b807c9d9f7d1402_tcQsF71c39ce96546f15007dffd2d86e6d2dd |
| iLovePDF Project ID | 305640 (domain filter ON: allpdfstuff.com) |
| Formspree | mvzwnjzr |
| ~~ImprovMX~~ | REPLACED by Namecheap Private Email (May 20, 2026) |
| Namecheap Private Email | support@allpdfstuff.com — Starter plan, valid May 20 2026 – May 20 2027 |
| Namecheap SMTP | `mail.privateemail.com` Port: 587 |
| Brevo SMTP (backup) | smtp-relay.brevo.com / login: a87d64001@smtp-brevo.com / pw: YFXPsKEB5DA0W1qh |
| Supabase Anon Key | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6aW1mZ3VhcXFja3Rva3d3ZGVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3OTQ4MTEsImV4cCI6MjA4OTM3MDgxMX0.OoxZQ4J0xltJYsa6T7Z0IlCueZGHgvEF97EJDO3LUaY |

---

## ADMIN ACCOUNTS (always Pro)
```js
const admins = ['darliak7@gmail.com', 'kongsomd_7@hotmail.com'];
```

---

## ✅ CHANGES MADE — MAY 20, 2026

### Problem Identified
Vercel Observability dashboard showed a spike of 4XX errors (up to ~25 requests) in
the Edge Requests graph. Build logs revealed 3 warnings causing the issues.

### Root Causes Found

| # | Warning | Impact |
|---|---------|--------|
| 1 | `stripe-webhook.js` being compiled from ESM to CommonJS | Broke Stripe signature verification → 4XX errors |
| 2 | `package.json` missing `"type": "module"` | Triggered ESM→CJS conversion |
| 3 | `memory` setting in `vercel.json` ignored on Active CPU billing | Harmless but noisy warning |

### Files Updated

#### 1. `package.json` — Added `"type": "module"`
```json
{
  "name": "allpdfstuff",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "stripe": "^14.0.0"
  }
}
```
**Why:** Tells Node.js to treat all `.js` files as native ESM — stops Vercel from
doing the ESM→CommonJS conversion that was breaking the webhook.

---

#### 2. `api/stripe-webhook.js` — Full rewrite (ESM + raw body fix)

Key changes:
- Converted to proper ESM (`import` / `export default`)
- Added `export const config = { api: { bodyParser: false } }` — **critical**: disables
  Vercel's automatic body parsing so Stripe gets the raw bytes it needs for
  signature verification
- Added `getRawBody()` helper to manually read the raw request buffer
- Added proper event handlers for: `checkout.session.completed`,
  `payment_intent.succeeded`, `payment_intent.payment_failed`,
  `customer.subscription.deleted`

**Why:** Vercel's default body parser was consuming the raw body before Stripe
could verify it — causing every webhook call to return 400/4XX.

---

#### 3. `vercel.json` — Removed deprecated `memory` setting
```json
{
  "version": 2,
  "functions": {
    "api/stripe-webhook.js": {
      "maxDuration": 30
    }
  },
  "routes": [
    {
      "src": "/api/stripe-webhook",
      "dest": "/api/stripe-webhook.js"
    }
  ]
}
```
**Why:** `memory` is ignored on Vercel's Active CPU billing plan. Replaced with
`maxDuration: 30` which is the correct setting for webhook handlers.

---

### Deployment Result

| | Before (commit `6b251d1`) | After (commit `1d5713f`) |
|---|---|---|
| ESM→CJS warning | ⚠️ Present | ✅ Gone |
| stripe-webhook compilation warning | ⚠️ Present | ✅ Gone |
| memory setting warning | ⚠️ Present | ✅ Gone |
| Build status | READY (with warnings) | **READY — clean** ✅ |
| Vercel CLI | 53.3.2 | 54.2.0 |

**Latest deployment ID:** `dpl_6k5aBMVx5Dk6cEEuCXx2nBw4rEgR`
**Deployed:** May 20, 2026 | Status: ✅ LIVE & OPERATIONAL

---

## ✅ EMAIL SETUP — MAY 20, 2026 (Later Session)

### Goal
Set up a fully working **send & receive** email at `support@allpdfstuff.com`.

### What Was Tried & Why Changed

| Service | Outcome |
|---|---|
| ImprovMX free | Receive-only — no SMTP on free plan ❌ |
| Brevo SMTP | Free SMTP works but no real inbox ⚠️ |
| Namecheap Private Email Starter | ✅ Full inbox — chosen solution |

### Actions Completed

| # | Action | Status |
|---|---|---|
| 1 | Purchased Namecheap Private Email Starter for allpdfstuff.com | ✅ Done |
| 2 | Deleted ImprovMX MX records from GoDaddy DNS (`mx1.improvmx.com`, `mx2.improvmx.com`) | ✅ Done |
| 3 | Deleted ImprovMX SPF TXT record (`v=spf1 include:spf.improvmx.com ~all`) | ✅ Done |
| 4 | Added Namecheap MX record: `mx1.privateemail.com` (Priority 10) | ✅ Done |
| 5 | Added Namecheap MX record: `mx2.privateemail.com` (Priority 10) | ✅ Done |
| 6 | Added Namecheap SPF TXT record: `v=spf1 include:spf.privateemail.com ~all` | ✅ Done |
| 7 | Create mailbox `support@allpdfstuff.com` in Namecheap | ⏳ Waiting for DNS (up to 4 hrs) |
| 8 | Set up on iPhone Mail | ⏳ After DNS propagation |
| 9 | Set up in Gmail as Send As | ⏳ After DNS propagation |

### DNS Records Preserved (Do NOT delete)
| Type | Name | Data | Why |
|---|---|---|---|
| MX | `send` | `feedback-smtp.ap-northeast-1.amazonaws.com` | Amazon SES |
| TXT | `dc-fd741b8612._spfm.send` | `v=spf1 include:amazonses.com ~all` | Amazon SES SPF |
| TXT | `resend...` | Long `p=MIG...` string | DKIM key |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine...` | DMARC security |
| CNAME | `www` | `32071f6de998a3ec.vercel-dns-017.co...` | Vercel DNS |
| A | `@` | `216.198.79.1` | Vercel A record |

### iPhone Mail Settings (use after DNS propagates)
| Field | Value |
|---|---|
| Name | AllPDFStuff Support |
| Email | `support@allpdfstuff.com` |
| Incoming (IMAP) Host | `mail.privateemail.com` |
| Outgoing (SMTP) Host | `mail.privateemail.com` |
| Port | `587` |
| Username | `support@allpdfstuff.com` |
| Password | *(password set in Namecheap mailbox)* |

### Gmail Send As Settings (use after DNS propagates)
| Field | Value |
|---|---|
| SMTP Server | `mail.privateemail.com` |
| Port | `587` |
| Username | `support@allpdfstuff.com` |
| Password | *(password set in Namecheap mailbox)* |

### DNS Propagation Check
Go to [dnschecker.org](https://dnschecker.org) → enter `allpdfstuff.com` → select **MX**
When `mx1.privateemail.com` shows green ✅ — DNS is live, proceed with mailbox setup.
| File | Status | Notes |
|---|---|---|
| index.html | ✅ Live | Main site — all 15 tools |
| about.html | ✅ Live | Founder page |
| account.html | ✅ Live | User dashboard |
| contact.html | ✅ Live | Formspree form |
| blog.html | ✅ Live | Empty — no content yet |
| privacy.html | ✅ Live | |
| terms.html | ✅ Live | |
| cookies.html | ✅ Live | |
| vercel.json | ✅ Updated May 20 | Removed memory setting, added maxDuration |
| api/stripe-webhook.js | ✅ Updated May 20 | Full ESM rewrite + raw body fix |
| package.json | ✅ Updated May 20 | Added "type": "module" |

---

## TOOL MAP (15 tools)
```js
const map = {
  'compress':'compress',         // FREE
  'merge':'merge',               // FREE
  'rotate':'rotate',             // FREE
  'word-to-pdf':'officepdf',     // FREE
  'split':'split',               // PRO
  'pdf-to-jpg':'pdfjpg',         // PRO
  'extract-text':'extract',      // PRO
  'repair':'repair',             // PRO
  'unlock':'unlock',             // PRO
  'protect-pdf':'protect',       // PRO
  'pdf-to-pdfa':'pdfa',          // PRO
  'convert-image':'imagepdf',    // PRO
  'page-numbers':'pagenumber',   // PRO
  'ocr-pdf':'pdfocr',            // PRO
  'watermark':'watermark'        // PRO (shows text/colour/opacity panel)
};
// API base: https://api.ilovepdf.com
// All tools require sign-in. Pro tools check isPro()
```

---

## SUPABASE TABLES
| Table | RLS | Notes |
|---|---|---|
| reviews | ✅ ON | approved=false by default. Anon+auth can INSERT. Only approved=true shown publicly. Constraints: name≤80, review≤500, role≤100 |
| subscriptions | ✅ ON | Users see own. Service role manages all |
| rate_limits | ✅ ON | Server-side task recording. Auth users see own |

### Supabase Functions
| Function | Type | Purpose |
|---|---|---|
| custom_access_token_hook | INVOKER | Injects plan+is_admin into JWT on login. Auth Hook enabled |
| check_rate_limit | SECURITY DEFINER | Records tasks server-side. Called from incLimit() |

---

## PENDING ITEMS & NEXT STEPS

| Priority | Item | Notes |
|---|---|---|
| 🔴 HIGH | Complete email mailbox setup | DNS propagating — go to privateemail.com → create `support@allpdfstuff.com` mailbox once live |
| 🔴 HIGH | Set up email on iPhone | Use `mail.privateemail.com` IMAP/SMTP settings above — after DNS |
| 🔴 HIGH | Set up Gmail Send As | Use `mail.privateemail.com` SMTP settings above — after DNS |
| 🔴 HIGH | Verify Stripe webhook env vars | Confirm `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` are set in Vercel → Settings → Environment Variables |
| 🔴 HIGH | Test Stripe webhook end-to-end | Use Stripe CLI: `stripe listen --forward-to https://www.allpdfstuff.com/api/stripe-webhook` |
| 🟡 MED | 2 unapproved reviews awaiting | Anna (Melbourne) and Sherley — go to Supabase → Table Editor → reviews → set approved=true |
| 🟡 MED | About page founder photo | Replace orange D circle with real photo. Upload to GitHub → update about.html img src |
| 🟢 LOW | Blog posts | blog.html exists but has no content |
| 🟢 LOW | Upgrade to Vercel Pro | For Observability Plus — anomaly alerts, custom queries, 30-day log retention |

---

## SECURITY STATUS
**29/29 Security Checks Passed** (as of April 18, 2026 — no regressions)

| ✅ Risk 1 CLEARED | Admin/Pro checks server-side |
|---|---|
| ✅ Risk 2 CLEARED | Server-side rate limiting |
| ✅ Risk 3 CLEARED | CSP & Security Headers |

---

## USEFUL LINKS
- **Live site:** https://www.allpdfstuff.com
- **GitHub repo:** https://github.com/darliak-crypto7/allpdfstuff
- **Vercel dashboard:** https://vercel.com/darliak7-7202s-projects/allpdfstuff
- **Supabase dashboard:** https://supabase.com/dashboard/project/pzimfguaqqcktokwwdeq
- **Stripe dashboard:** https://dashboard.stripe.com
- **iLovePDF dashboard:** https://developer.ilovepdf.com
- **Formspree dashboard:** https://formspree.io/forms/mvzwnjzr

---

## HOW TO USE THIS DOCUMENT
If the website crashes or something breaks, drop this file plus the affected HTML
file into a new Claude conversation and say:
> "My website allpdfstuff.com is broken. Here is my reference document and the
> affected file. Please fix it."

Claude will have everything it needs to diagnose and fix issues immediately.

---

⚠️ **CONFIDENTIAL — Keep this document private. Do not share publicly.**

*Last updated: May 20, 2026 | AllPDFStuff.com | Maintained by Darlia via Natural Mind Concepts*
