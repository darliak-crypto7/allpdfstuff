# AllPDFStuff.com — Session Handoff
**Date:** April 19, 2026 | **Site:** https://www.allpdfstuff.com

---

## ACCOUNTS & KEYS
| Service | Detail |
|---|---|
| GitHub | darliak-crypto7/allpdfstuff |
| Vercel | Auto-deploys on GitHub commit (~40 sec) |
| Supabase Project ID | pzimfguaqqcktokwwdeq |
| Supabase Anon Key | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6aW1mZ3VhcXFja3Rva3d3ZGVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3OTQ4MTEsImV4cCI6MjA4OTM3MDgxMX0.OoxZQ4J0xltJYsa6T7Z0IlCueZGHgvEF97EJDO3LUaY |
| Stripe Live Publishable Key | pk_live_51TBygSJEuTHMKBHAkY5CekZDzRCpWHy16X8jJ1FPGHimrLwFxNnKxjt7tB6RtOgGT6WdEEw7uXhopoO0oI85D7AK00M2ZM839H |
| Stripe Payment Link | https://buy.stripe.com/4gM00kf9Igxo2798NX1ck00 |
| iLovePDF Public Key | project_public_c3a9e8f2fc9c20c33b807c9d9f7d1402_tcQsF71c39ce96546f15007dffd2d86e6d2dd |
| iLovePDF Project ID | 305640 (domain filter ON: allpdfstuff.com) |
| Formspree | mvzwnjzr |
| ImprovMX | support@allpdfstuff.com → darlia629@gmail.com |
| Google Analytics | G-ZP7PTTQBX6 |

---

## ADMIN ACCOUNTS (always Pro, hardcoded)
```
darliak7@gmail.com
kongsomd_7@hotmail.com
```

---

## TECH STACK
| Layer | Service |
|---|---|
| Hosting | Vercel |
| Frontend | index.html (vanilla HTML/CSS/JS, no framework) |
| Auth | Supabase email/password |
| Database | Supabase (Postgres) |
| Payments | Stripe (Live mode) |
| PDF Processing | iLovePDF API |
| Contact/Newsletter | Formspree (mvzwnjzr) |
| Email forwarding | ImprovMX |
| Domain | GoDaddy → Vercel DNS |

---

## FILES IN REPO
| File | Notes |
|---|---|
| index.html | Main app — all 15 tools |
| about.html | Founder page |
| account.html | User dashboard |
| contact.html | Formspree form |
| blog.html | Blog listing page |
| blog-post-1.html | Compress PDF article |
| blog-how-to-merge-pdfs.html | Merge PDF article |
| blog-repair-pdf.html | Repair PDF article |
| privacy.html / terms.html / cookies.html | Legal pages |
| compress-pdf.html / merge-pdf.html / split-pdf.html | SEO landing pages |
| pdf-to-word.html / word-to-pdf.html | SEO landing pages |
| vercel.json | Security headers + cleanUrls: true |
| api/ | Stripe webhook handler |

---

## TOOL MAP (15 tools)
| UI Name | iLovePDF API Name | Plan |
|---|---|---|
| Compress PDF | compress | FREE |
| Merge PDF | merge | FREE |
| Rotate PDF | rotate | FREE |
| Word to PDF | officepdf | FREE |
| Split PDF | split | PRO |
| PDF to JPG | pdfjpg | PRO |
| Extract Text | extract | PRO |
| Repair PDF | repair | PRO |
| Unlock PDF | unlock | PRO |
| Protect PDF | protect | PRO |
| PDF to PDF/A | pdfa | PRO |
| Image to PDF | imagepdf | PRO |
| Page Numbers | pagenumber | PRO |
| OCR PDF | pdfocr | PRO |
| Watermark PDF | watermark | PRO |

> ⚠️ Image tools (resize/rotate image) need iLoveIMG API — do NOT add without a new iLoveIMG key.

---

## SUPABASE DATABASE

### Tables & RLS Status
| Table | RLS | Notes |
|---|---|---|
| rate_limits | ✅ ON | Tracks usage per user per day |
| reviews | ✅ ON | Public testimonials with admin approval |
| subscriptions | ✅ ON | Stripe plan data — managed by service_role only |

### RLS Policies (current state after April 19 fixes)
**rate_limits**
- authenticated: SELECT, INSERT, UPDATE own records (`auth.uid() = user_id`)

**reviews**
- anon: SELECT approved only | INSERT with validation (rating 1–5, non-empty name+review)
- authenticated: SELECT approved only | INSERT with validation (rating 1–5, non-empty name+review)

**subscriptions**
- public (service_role): ALL operations
- public: SELECT own subscription (`auth.uid() = user_id`)

### Supabase Functions
| Function | Notes |
|---|---|
| check_rate_limit(p_user_id, p_action, p_limit) | SECURITY DEFINER, search_path locked |
| custom_access_token_hook(event jsonb) | Injects is_admin + plan into JWT claims |

### Migrations Applied
| Version | Name |
|---|---|
| 20260328070000 | create_subscriptions_table |
| 20260401020241 | allow_authenticated_review_insert |
| 20260419040816 | fix_security_advisor_warnings |
| 20260419110403 | fix_overpermissive_grants |

---

## SECURITY STATUS (as of April 19, 2026)
| Check | Status |
|---|---|
| RLS enabled on all tables | ✅ |
| Function search paths locked (SET search_path = '') | ✅ |
| RLS INSERT policies scoped (not always-true) | ✅ |
| anon has zero access to rate_limits | ✅ |
| anon has zero access to subscriptions | ✅ |
| anon on reviews: SELECT + INSERT only (no DELETE/UPDATE) | ✅ |
| authenticated on reviews: SELECT + INSERT only | ✅ |
| authenticated on subscriptions: SELECT only | ✅ |
| Security headers in vercel.json (CSP, HSTS, X-Frame etc.) | ✅ |
| Leaked password protection (HaveIBeenPwned) | ⏸️ Pro plan required — skipped |

**Security Advisor warnings remaining:** 1 (password protection — Pro only, acceptable)

---

## PLANS & LIMITS
| Plan | Price | Tasks/Month | File Size |
|---|---|---|---|
| Free | $0 | 5 | 10 MB |
| Pro | $9.99/month | 50 | 100 MB |

---

## PENDING / TO-DO
| Priority | Task |
|---|---|
| 🟡 Medium | Submit SEO pages to Google Search Console (compress, merge, split, pdf-to-word, word-to-pdf) |
| 🟡 Medium | New blog posts for SEO |
| 🟢 Low | Stripe checkout upgrade — server-side session instead of Payment Link |
| 🟢 Low | Long-tail SEO pages (/compress-pdf-under-1mb etc.) |
| 🟢 Low | Backlinks: Product Hunt, AlternativeTo.net, Medium/Dev.to |

---

## USEFUL LINKS
- Live site: https://www.allpdfstuff.com
- GitHub: https://github.com/darliak-crypto7/allpdfstuff
- Vercel: https://vercel.com/darliak7-7202s-projects/allpdfstuff
- Supabase: https://supabase.com/dashboard/project/pzimfguaqqcktokwwdeq
- Stripe: https://dashboard.stripe.com
- iLovePDF: https://developer.ilovepdf.com
- Formspree: https://formspree.io/forms/mvzwnjzr

---

*Last updated: April 19, 2026 | AllPDFStuff.com*
