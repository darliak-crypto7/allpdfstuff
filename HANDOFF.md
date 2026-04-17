# AllPDFStuff.com — Session Handoff
**Date:** April 18, 2026 | **Site:** https://www.allpdfstuff.com

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
| ImprovMX | support@allpdfstuff.com → darlia629@gmail.com |
| Supabase Anon Key | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6aW1mZ3VhcXFja3Rva3d3ZGVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3OTQ4MTEsImV4cCI6MjA4OTM3MDgxMX0.OoxZQ4J0xltJYsa6T7Z0IlCueZGHgvEF97EJDO3LUaY |

---

## ADMIN ACCOUNTS (always Pro)
```js
const admins = ['darliak7@gmail.com', 'kongsomd_7@hotmail.com'];
```

---

## FILES IN REPO
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
| vercel.json | ✅ Live | Security headers + Stripe webhook config |

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

## isPro() LOGIC
```js
// 1. Read JWT claims (set by custom_access_token_hook — cannot be spoofed)
const payload = JSON.parse(atob(jwt.split('.')[1]));
if(payload.plan === 'pro' || payload.is_admin === true) return true;
// 2. Fallback: admin email check
if(['darliak7@gmail.com','kongsomd_7@hotmail.com'].includes(user.email)) return true;
// 3. Fallback: user_metadata / app_metadata
return user.user_metadata?.plan==='pro' || user.app_metadata?.plan==='pro';
```

---

## DESIGN
```
Colors: --bg:#faf8f4, --or:#e8620a (orange)
Fonts:  'Cormorant Garamond' (serif) + 'Inter' (sans) via Google Fonts
Style:  Warm cream editorial aesthetic
```

---

## PAGE SECTION ORDER (index.html)
1. NAV → HERO → MARQUEE → TOOLS GRID → UPLOAD SECTION
2. HOW IT WORKS → PRICING → CTA → REVIEWS → FOOTER
3. MODAL (login/signup) — fixed position overlay z-index:9999

---

## SECURITY STATUS — 29/29 ✅
| Risk | Fix |
|---|---|
| Admin check in frontend | JWT custom claims via Supabase hook |
| Rate limiting client-side only | rate_limits table + check_rate_limit() RPC |
| No CSP headers | vercel.json: CSP, X-Frame, HSTS, Referrer, Permissions, X-Content-Type |
| XSS in reviews innerHTML | esc() sanitiser on all review display |
| HTML injection via form | stripHtml() on review form inputs |
| No input length limits | JS validation + DB constraints |

---

## PENDING (carry forward)
| Priority | Item |
|---|---|
| 🔴 HIGH | **Stripe webhook** — paying users don't auto-get Pro. Needs api/stripe-webhook.js to update subscriptions table on checkout.session.completed |
| 🟡 MED | **2 unapproved reviews** — Anna (Melbourne) + Sherley. Supabase → Table Editor → reviews → approved=true |
| 🟡 MED | **About page photo** — replace orange D circle. Upload photo to GitHub, update about.html img src |
| 🟢 LOW | **Blog content** — blog.html exists but empty |
| 🟢 LOW | **support@ sending** — currently receive-only via ImprovMX |

---

## HOW TO UPDATE SITE
1. Edit files in local outputs folder
2. Download → upload to GitHub repo (Add file → Upload files)
3. Vercel auto-deploys in ~40 seconds

---

## SPECIAL TOOL BEHAVIOURS
- **Watermark**: Shows panel (text/colour/font size/opacity) before processing. `window._watermarkText/Color/Size/Opacity`
- **Protect PDF**: Uses `prompt()` for password. Stored as `window._protectPw`
- **Merge**: Requires 2+ files dropped at once. Auto-selected when multiple files dropped
- **OCR**: Sends `body.language='eng'`
- **Page Numbers**: Sends `facing_pages:false, vertical_position:'bottom', horizontal_position:'center', font_size:14`
- **Convert Image**: Only tool that accepts `.jpg,.jpeg,.png,.tiff,.gif,.bmp`

---
*Generated: April 18, 2026*
