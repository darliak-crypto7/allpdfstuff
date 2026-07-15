# AllPDFStuff.com — Session Handoff
**Date:** July 14, 2026 | **Site:** https://www.allpdfstuff.com

---

## ✅ CHANGES MADE — JULY 14, 2026

### Goal
Give every PDF tool its own indexable URL for SEO (previously all 15 tools lived behind `#upload` anchors on a single homepage — invisible to Google as separate pages).

### What Was Built

| # | File | What it is |
|---|------|-----------|
| 1 | `assets/style.css` | Shared design-system CSS, extracted verbatim from `index.html`'s inline `<style>` block, plus a few small additions (`.hero-tool`, `.feat-grid`, `.faq-list`, `.breadcrumb`) for the new landing pages. |
| 2 | `assets/app.js` | Shared app logic (Supabase auth, Stripe, iLovePDF upload/process/download, nav, modal, toast), extracted verbatim from `index.html`'s inline script. Added one new function `initToolPage(toolId)` and a small branch in `showPicker()` so single-tool pages skip the multi-tool picker UI and jump straight to processing. |
| 3 | `generate_tool_pages.py` | Python generator — holds all per-tool SEO copy (title, meta description, H1, 3 feature bullets, 4 FAQ Q&As with FAQPage JSON-LD) and writes the 15 HTML files. **Re-run this script (`python3 generate_tool_pages.py`) any time tool copy needs updating** — it always overwrites the files below. |
| 4–18 | 15 new `.html` files (see list below) | Dedicated landing page per tool. Each has a unique `<title>`, meta description, canonical URL, FAQPage schema, unique intro copy, and reuses the exact same upload widget + auth + iLovePDF logic as the homepage via `assets/app.js`. |

### New Pages Created (all live at site root)
| URL | Tool | Tier |
|---|---|---|
| `/compress-pdf.html` | Compress PDF | Free |
| `/merge-pdf.html` | Merge PDF | Free |
| `/split-pdf.html` | Split PDF | Pro |
| `/pdf-to-jpg.html` | PDF to JPG | Pro |
| `/word-to-pdf.html` | Word to PDF | Free |
| `/rotate-pdf.html` | Rotate PDF | Free |
| `/extract-text-from-pdf.html` | Extract Text | Pro |
| `/repair-pdf.html` | Repair PDF | Pro |
| `/unlock-pdf.html` | Unlock PDF | Pro |
| `/protect-pdf.html` | Protect PDF | Pro |
| `/pdf-to-pdfa.html` | PDF to PDF/A | Pro |
| `/image-to-pdf.html` | Image to PDF | Pro |
| `/add-page-numbers-to-pdf.html` | Page Numbers | Pro |
| `/ocr-pdf.html` | OCR PDF | Pro |
| `/watermark-pdf.html` | Watermark PDF | Pro |

### index.html Changes
- All 15 tool cards in the `.tools-grid` now link directly to their dedicated page (e.g. `href="/compress-pdf.html"`) instead of `href="#upload" onclick="selectTool(...)"`.
- Footer "Tools" column links updated to point to the same dedicated pages.
- **index.html's own inline CSS/JS was left untouched** (not switched to the shared `assets/` files) to avoid any regression risk on the currently-live homepage. Only the tool card/footer hrefs changed.

### sitemap.xml
- Added all 15 new URLs, `priority 0.9`, `changefreq weekly` (higher priority than existing pages — these are the primary SEO growth pages now).

### How the single-tool pages work
Each page loads `assets/style.css` + `assets/app.js`, then calls:
```html
<script>
  document.addEventListener('DOMContentLoaded', function() {
    initToolPage('compress'); // the iLovePDF tool key for this page
  });
</script>
```
`initToolPage()` presets `window.PRESET_TOOL` and calls the existing `selectTool()`. When a user drops a file, `showPicker()` sees `PRESET_TOOL` is set and calls `pickAndGo(PRESET_TOOL)` directly — skipping the "what do you want to do with this file?" picker step entirely, since the page itself already declares the tool. All existing logic (login gate, Pro-tool gate, password prompt for Protect PDF, watermark panel, monthly task limits, iLovePDF API calls) is reused unchanged from the same `pickAndGo`/`go`/`api` functions.

---

## PENDING ITEMS & NEXT STEPS

| Priority | Item | Notes |
|---|---|---|
| 🔴 HIGH | Push to GitHub → Vercel auto-deploy | Upload `assets/style.css`, `assets/app.js`, `generate_tool_pages.py`, all 15 new `.html` files, updated `index.html`, and updated `sitemap.xml` to `darliak-crypto7/allpdfstuff`. |
| 🔴 HIGH | Submit updated sitemap in Google Search Console | Resubmit `sitemap.xml` so Google discovers and indexes the 15 new URLs. Indexing typically takes days to a few weeks. |
| 🟡 MED | Consider adding a few of these tool pages as targets for backlink/directory outreach | See prior growth conversation — Product Hunt, AlternativeTo, "best free PDF tools" roundups, Reddit. Point outreach links at the specific tool page, not just the homepage. |
| 🟡 MED | Add Organization/SoftwareApplication schema | Only FAQPage schema was added this round; a sitewide Organization schema on the homepage would further help rich results. |
| 🟢 LOW | Blog content | Still empty (`blog.html`) — long-tail "how to" posts linking into these tool pages would compound the SEO benefit. |

---

## HOW TO USE THIS DOCUMENT
If something on these pages breaks or needs updating, drop this file (or `ALLPDFSTUFF-REFERENCE.md`) plus the affected file into a new Claude conversation and describe the issue — Claude will have the context needed to fix it or regenerate pages via `generate_tool_pages.py`.

---

⚠️ **CONFIDENTIAL — Keep this document private. Do not share publicly.**

*Last updated: July 14, 2026 | AllPDFStuff.com*
