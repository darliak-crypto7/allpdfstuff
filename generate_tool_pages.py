#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generates a dedicated, SEO-friendly landing page (own URL, own <title>,
own copy + FAQ) for every PDF tool on AllPDFStuff.com.

Each page reuses the shared design system (assets/style.css) and shared
app logic (assets/app.js) instead of duplicating ~100KB of CSS/JS per
page. Re-run this script any time tool copy/FAQs need updating —
it always overwrites the generated *.html files listed in TOOLS below.

Usage:  python3 generate_tool_pages.py
"""
import json
import os

SITE_URL = "https://www.allpdfstuff.com"
OUT_DIR = os.path.dirname(os.path.abspath(__file__))

TOOLS = [
    dict(
        id="compress", slug="compress-pdf", name="Compress PDF", icon="🗜️", badge="Free",
        title="Compress PDF Online Free – Reduce File Size Without Losing Quality | AllPDFStuff",
        meta="Shrink large PDF files in seconds, right in your browser. No software, no email size limits. Free to start — compress PDFs for email, upload, or archiving.",
        h1_pre="Compress PDF files", h1_em="without losing quality",
        intro="Big PDF bouncing back from an email server? Drop it in and get a smaller file in seconds — no installs, no watermarks, no waiting.",
        features=[
            ("🗜️", "Smart compression", "Shrinks file size while keeping text and images sharp enough to read and print."),
            ("📧", "Built for email limits", "Get scanned contracts, statements, and reports under the size caps most inboxes enforce."),
            ("🔒", "Private by design", "Files are processed and then automatically deleted within an hour — nothing sits around."),
        ],
        faq=[
            ("Does compressing a PDF reduce its quality?", "Our compression is tuned to remove redundant data and re-encode images efficiently, so text stays sharp and images stay legible. For most everyday documents you won't notice a visual difference."),
            ("Is there a file size limit?", "Free accounts can compress files up to 10 MB; Pro accounts get up to 100 MB per file plus a higher monthly task allowance."),
            ("What happens to my file after I download it?", "Uploaded files are automatically deleted from our servers within one hour of processing — we don't keep copies."),
            ("Do I need to install anything?", "No. Everything runs in your browser. There's nothing to download or install on your computer."),
        ],
    ),
    dict(
        id="merge", slug="merge-pdf", name="Merge PDF", icon="🔗", badge="Free",
        title="Merge PDF Files Online Free – Combine Multiple PDFs Into One | AllPDFStuff",
        meta="Combine two or more PDF files into a single document in seconds. Drag, drop, and download — free, fast, and works right in your browser.",
        h1_pre="Merge multiple PDFs", h1_em="into one file",
        intro="Combine reports, statements, or scanned pages into a single, easy-to-share document — in the order you drop them.",
        features=[
            ("🔗", "Combine any number of files", "Merge as many PDFs as you need, up to your plan's per-file size limit."),
            ("📑", "Keeps original order", "Files merge in the exact order you upload them, so nothing gets shuffled."),
            ("⚡", "Instant download", "Get one clean, combined PDF back in seconds."),
        ],
        faq=[
            ("How many PDFs can I merge at once?", "Drop as many files as you like in a single batch — they'll be combined in the order you added them."),
            ("Will merging change the formatting of my pages?", "No — each page keeps its original layout, size, and orientation; merging only stitches the documents together."),
            ("Can I merge Word documents too?", "This tool merges PDFs specifically. Convert Word files to PDF first using our Word to PDF tool, then merge."),
            ("Is merging PDFs free?", "Yes, Merge is one of our free tools — no credit card required to get started."),
        ],
    ),
    dict(
        id="split", slug="split-pdf", name="Split PDF", icon="✂️", badge="Pro",
        title="Split PDF Online – Extract or Divide Pages Into Separate Files | AllPDFStuff",
        meta="Pull out specific pages or break a large PDF into multiple smaller files. Fast, browser-based PDF splitting — no software required.",
        h1_pre="Split a PDF", h1_em="into separate files",
        intro="Pull out the pages you need, or divide a long document into smaller, shareable files — without opening a desktop app.",
        features=[
            ("✂️", "Extract exact pages", "Pull individual pages or ranges out of a larger PDF."),
            ("📂", "Divide into multiple files", "Break one long document into several smaller ones."),
            ("🔐", "Pro tool", "Included on the Pro plan alongside 100 MB uploads and 50 tasks a month."),
        ],
        faq=[
            ("Can I choose which pages to extract?", "Yes — upload your PDF and specify the pages or ranges you want pulled out into their own file(s)."),
            ("What if my file has hundreds of pages?", "Split handles large documents fine; Pro accounts get a 100 MB per-file limit for exactly this kind of use case."),
            ("Do I get one file back or several?", "Depending on how you split it, you'll get either individual page files or several smaller PDFs, delivered as a downloadable set."),
            ("Is Split PDF free?", "Split is a Pro tool. Free accounts can try our four free tools — Compress, Merge, Rotate, and Word to PDF — before upgrading."),
        ],
    ),
    dict(
        id="pdf-to-jpg", slug="pdf-to-jpg", name="PDF to JPG", icon="🖼️", badge="Pro",
        title="PDF to JPG Converter Online – Turn PDF Pages Into Images | AllPDFStuff",
        meta="Convert every page of a PDF into high-quality JPG images in seconds. Great for slides, previews, and sharing on platforms that don't accept PDFs.",
        h1_pre="Turn PDF pages", h1_em="into JPG images",
        intro="Need an image of a page instead of a full document? Convert any PDF into high-quality JPGs in one click.",
        features=[
            ("🖼️", "Page-by-page images", "Every page in your PDF becomes its own high-resolution JPG."),
            ("📦", "Batch download", "Get all converted images together in one download."),
            ("🔐", "Pro tool", "Unlocked with a Pro plan."),
        ],
        faq=[
            ("Does it convert every page or just one?", "By default every page in your PDF is converted to its own JPG image, delivered together in a single download."),
            ("What resolution are the images?", "Images are rendered at high quality, suitable for previews, presentations, or printing."),
            ("Can I go the other direction — image to PDF?", "Yes, use our Image to PDF tool to convert JPG, PNG, and other image formats back into a PDF."),
            ("Is PDF to JPG free?", "It's a Pro tool. Sign up free to try Compress, Merge, Rotate, and Word to PDF, then upgrade for image conversion and more."),
        ],
    ),
    dict(
        id="word-to-pdf", slug="word-to-pdf", name="Word to PDF", icon="📄", badge="Free",
        title="Word to PDF Converter Online Free – Convert DOC & DOCX to PDF | AllPDFStuff",
        meta="Convert Word documents (.doc, .docx) to PDF while preserving your exact layout, fonts, and formatting. Free, fast, browser-based.",
        h1_pre="Convert Word documents", h1_em="to PDF",
        intro="Turn a .doc or .docx file into a clean, shareable PDF that looks the same on every device — fonts, spacing, and formatting intact.",
        features=[
            ("📄", "Layout preserved", "Fonts, tables, and spacing convert exactly as they appear in Word."),
            ("🆓", "Free tool", "No Pro plan needed for everyday conversions."),
            ("↔️", "Works with .doc and .docx", "Both legacy and modern Word formats are supported."),
        ],
        faq=[
            ("Will my formatting stay the same?", "Yes — tables, fonts, headers, and page breaks convert to match your original Word document."),
            ("Does it work with both .doc and .docx?", "Yes, both classic .doc files and modern .docx files are supported."),
            ("Is Word to PDF free?", "Yes, it's one of our free tools alongside Compress, Merge, and Rotate."),
            ("Can I convert a PDF back to Word?", "Support for PDF to Word is on our roadmap — for now, our tools focus on the conversions listed on this page."),
        ],
    ),
    dict(
        id="rotate", slug="rotate-pdf", name="Rotate PDF", icon="🔄", badge="Free",
        title="Rotate PDF Online Free – Fix Sideways or Upside-Down Pages | AllPDFStuff",
        meta="Rotate PDF pages 90 degrees in one click. Fix scanned documents that came out sideways — free, fast, no software needed.",
        h1_pre="Rotate PDF pages", h1_em="in one click",
        intro="Scanned a page sideways? Fix the orientation instantly — no need to rescan or open a desktop editor.",
        features=[
            ("🔄", "One-click rotation", "Fixes sideways or upside-down pages instantly."),
            ("🆓", "Free tool", "No account upgrade required."),
            ("📠", "Great for scans", "Perfect for documents that came out of a scanner at the wrong angle."),
        ],
        faq=[
            ("Can I rotate just one page instead of the whole document?", "Currently, rotation applies to the whole document; page-specific rotation is on our roadmap."),
            ("Will rotating affect the quality of my PDF?", "No — rotation only changes page orientation, not the underlying content or resolution."),
            ("Is Rotate PDF free?", "Yes, it's a free tool within our standard 5 tasks/month free allowance."),
            ("What if my scanner produces upside-down pages every time?", "You can rotate as many files as you need within your monthly task allowance."),
        ],
    ),
    dict(
        id="extract-text", slug="extract-text-from-pdf", name="Extract Text", icon="📃", badge="Pro",
        title="Extract Text From PDF Online – Convert PDF to TXT | AllPDFStuff",
        meta="Pull all the text out of a PDF and save it as a plain .txt file. Useful for copying content into other documents or systems. Fast and browser-based.",
        h1_pre="Extract all the text", h1_em="from a PDF",
        intro="Need the raw text out of a PDF — for a script, a database, or just to copy into another document? Extract it in seconds.",
        features=[
            ("📃", "Full text extraction", "Pulls all readable text out of the document."),
            ("💾", "Plain .txt output", "Easy to paste, search, or import elsewhere."),
            ("🔐", "Pro tool", "Unlocked with a Pro plan."),
        ],
        faq=[
            ("Does this work on scanned PDFs?", "Extract Text works best on PDFs that already contain selectable text. For scanned images, run OCR PDF first to make the text recognizable, then extract."),
            ("What format is the output?", "You'll get a plain .txt file containing all the extracted text."),
            ("Will formatting like tables be preserved?", "Text extraction focuses on raw text content; complex formatting like tables and columns may not be preserved exactly."),
            ("Is Extract Text free?", "It's a Pro tool. Free accounts can try Compress, Merge, Rotate, and Word to PDF first."),
        ],
    ),
    dict(
        id="repair", slug="repair-pdf", name="Repair PDF", icon="🔧", badge="Pro",
        title="Repair PDF Online – Fix Corrupted or Broken PDF Files | AllPDFStuff",
        meta="Fix a PDF that won't open, looks corrupted, or throws errors. Repair damaged PDF files in seconds, right in your browser.",
        h1_pre="Repair a corrupted", h1_em="PDF file",
        intro="PDF won't open, or throwing an error? Upload it and we'll attempt to rebuild it into a working file.",
        features=[
            ("🔧", "Fixes common corruption", "Rebuilds damaged file structures so the PDF opens normally again."),
            ("⚡", "Fast turnaround", "Most repairs complete in seconds."),
            ("🔐", "Pro tool", "Unlocked with a Pro plan."),
        ],
        faq=[
            ("What causes a PDF to become corrupted?", "Common causes include interrupted downloads, failed transfers, or issues during the original file creation."),
            ("Can every broken PDF be repaired?", "Most structural issues can be fixed, but severely damaged or incomplete files may not be fully recoverable."),
            ("Will repairing change my content?", "No — repair only rebuilds the file structure; page content is preserved as-is."),
            ("Is Repair PDF free?", "It's a Pro tool, included with the Pro plan."),
        ],
    ),
    dict(
        id="unlock", slug="unlock-pdf", name="Unlock PDF", icon="🔓", badge="Pro",
        title="Unlock PDF Online – Remove Password From a PDF File | AllPDFStuff",
        meta="Remove password protection from a PDF you own so you can read, edit, or print it freely. Fast and secure, right in your browser.",
        h1_pre="Remove password protection", h1_em="from a PDF",
        intro="Own a password-protected PDF and need to read, edit, or print it freely? Unlock it in seconds.",
        features=[
            ("🔓", "Removes owner passwords", "Lifts editing and printing restrictions."),
            ("⚡", "Instant processing", "Done in seconds, no software install."),
            ("🔐", "Pro tool", "Unlocked with a Pro plan."),
        ],
        faq=[
            ("Do I need to know the password to unlock a PDF?", "You'll typically need the password to open the file for processing. This tool is intended for PDFs you own or have permission to modify."),
            ("Is it legal to remove a PDF password?", "Only remove protection from files you own or are authorized to modify. Removing protection from documents without permission may violate applicable laws or agreements."),
            ("Will unlocking affect the content?", "No — unlocking only removes the security restrictions, not the document content."),
            ("Is Unlock PDF free?", "It's a Pro tool, included with the Pro plan."),
        ],
    ),
    dict(
        id="protect-pdf", slug="protect-pdf", name="Protect PDF", icon="🔒", badge="Pro",
        title="Password Protect PDF Online – Encrypt Your PDF Files | AllPDFStuff",
        meta="Add a password to a PDF to prevent unauthorized viewing or editing. Encrypt sensitive documents in seconds, right in your browser.",
        h1_pre="Password protect", h1_em="your PDF",
        intro="Sending something sensitive? Add a password so only the people you share it with can open the file.",
        features=[
            ("🔒", "128-bit encryption", "Protects your PDF with a password you set."),
            ("🛡️", "Great for sensitive documents", "Contracts, statements, and confidential reports."),
            ("🔐", "Pro tool", "Unlocked with a Pro plan."),
        ],
        faq=[
            ("What encryption does this use?", "Files are encrypted with a password you set, using 128-bit encryption."),
            ("Can I remove the password later?", "Yes — use our Unlock PDF tool with the correct password to remove the protection later."),
            ("Will I be able to recover a forgotten password?", "No — keep your password somewhere safe. We don't store it and can't recover it for you."),
            ("Is Protect PDF free?", "It's a Pro tool, included with the Pro plan."),
        ],
    ),
    dict(
        id="pdf-to-pdfa", slug="pdf-to-pdfa", name="PDF to PDF/A", icon="📋", badge="Pro",
        title="Convert PDF to PDF/A Online – Archival Format for Compliance | AllPDFStuff",
        meta="Convert any PDF into the PDF/A archival standard for long-term storage and regulatory compliance. Fast, browser-based conversion.",
        h1_pre="Convert PDF to", h1_em="PDF/A for archiving",
        intro="Need a document in the PDF/A standard for long-term retention or a compliance requirement? Convert it in one step.",
        features=[
            ("📋", "PDF/A-1b conformance", "Meets one of the most widely used archival standards."),
            ("🏦", "Built for compliance", "Useful for records retention, audits, and regulated industries."),
            ("🔐", "Pro tool", "Unlocked with a Pro plan."),
        ],
        faq=[
            ("What is PDF/A and why would I need it?", "PDF/A is an ISO standard for long-term archiving. It embeds fonts and restricts features that could make a file unreadable in the future — often required for legal, financial, or government records."),
            ("Which PDF/A conformance level do you produce?", "Files are converted to PDF/A-1b, one of the most widely accepted conformance levels."),
            ("Will the visual appearance of my document change?", "No — the goal of PDF/A conversion is to preserve exactly how the document looks while making it suitable for long-term storage."),
            ("Is PDF to PDF/A free?", "It's a Pro tool, included with the Pro plan."),
        ],
    ),
    dict(
        id="convert-image", slug="image-to-pdf", name="Image to PDF", icon="🖼️", badge="Pro",
        title="Image to PDF Converter Online – Convert JPG, PNG & More to PDF | AllPDFStuff",
        meta="Convert JPG, PNG, TIFF, and other image formats into a PDF document. Combine multiple images into one file, right in your browser.",
        h1_pre="Convert images", h1_em="to PDF",
        intro="Turn photos, scans, or screenshots into a single, shareable PDF document.",
        features=[
            ("🖼️", "Multiple formats supported", "JPG, PNG, TIFF, GIF, and BMP."),
            ("📑", "Combine several images", "Turn a batch of photos into one PDF."),
            ("🔐", "Pro tool", "Unlocked with a Pro plan."),
        ],
        faq=[
            ("Which image formats can I convert?", "JPG, PNG, TIFF, GIF, and BMP are all supported."),
            ("Can I combine multiple images into a single PDF?", "Yes — upload several images and they'll be combined into one PDF document."),
            ("Will image quality be preserved?", "Yes, images are placed into the PDF at their original quality."),
            ("Is Image to PDF free?", "It's a Pro tool, included with the Pro plan."),
        ],
    ),
    dict(
        id="page-numbers", slug="add-page-numbers-to-pdf", name="Page Numbers", icon="🔢", badge="Pro",
        title="Add Page Numbers to PDF Online – Number Every Page Automatically | AllPDFStuff",
        meta="Insert page numbers into any PDF automatically. Choose position and style — fast, browser-based, no software required.",
        h1_pre="Add page numbers", h1_em="to your PDF",
        intro="Make a long document easier to navigate and reference — add page numbers automatically, no manual editing required.",
        features=[
            ("🔢", "Automatic numbering", "Every page gets numbered consistently."),
            ("📍", "Configurable position", "Numbers are placed in a clean, consistent spot by default."),
            ("🔐", "Pro tool", "Unlocked with a Pro plan."),
        ],
        faq=[
            ("Can I choose where the page numbers appear?", "Numbers are placed automatically in a clean, consistent position on each page."),
            ("Will it renumber a document that already has page numbers printed on it?", "This tool adds a new numbering layer; it doesn't remove text that's already part of the page content."),
            ("Does it work on very long documents?", "Yes — every page in the document is numbered automatically, regardless of length."),
            ("Is Add Page Numbers free?", "It's a Pro tool, included with the Pro plan."),
        ],
    ),
    dict(
        id="ocr-pdf", slug="ocr-pdf", name="OCR PDF", icon="🔍", badge="Pro",
        title="OCR PDF Online – Make Scanned PDFs Searchable & Editable | AllPDFStuff",
        meta="Convert a scanned PDF into a searchable, selectable document using OCR. Great for scanned contracts, statements, and archives.",
        h1_pre="Make a scanned PDF", h1_em="searchable",
        intro="Scanned documents are just images — you can't search or select the text. OCR turns them into a real, searchable PDF.",
        features=[
            ("🔍", "Recognizes printed text", "Turns scanned pages into selectable, searchable text."),
            ("🗂️", "Great for archives", "Makes old scanned records searchable again."),
            ("🔐", "Pro tool", "Unlocked with a Pro plan."),
        ],
        faq=[
            ("What is OCR?", "Optical Character Recognition (OCR) analyzes a scanned image and recognizes the printed text, turning it into real, selectable text within the PDF."),
            ("Does OCR work on handwriting?", "OCR is optimized for printed text; handwritten text recognition is less reliable."),
            ("What language does OCR support?", "Our OCR tool processes documents in English by default."),
            ("Is OCR PDF free?", "It's a Pro tool, included with the Pro plan."),
        ],
    ),
    dict(
        id="watermark", slug="watermark-pdf", name="Watermark PDF", icon="💧", badge="Pro",
        title="Add Watermark to PDF Online – Text Watermarks in Seconds | AllPDFStuff",
        meta="Add a custom text watermark — like CONFIDENTIAL or DRAFT — to any PDF. Choose your text, color, size, and opacity.",
        h1_pre="Add a watermark", h1_em="to your PDF",
        intro="Mark a document as CONFIDENTIAL, DRAFT, or SAMPLE — or add your own custom text watermark, styled exactly how you want it.",
        features=[
            ("💧", "Custom text", "Type any watermark text you need."),
            ("🎨", "Full control", "Set color, font size, and opacity."),
            ("🔐", "Pro tool", "Unlocked with a Pro plan."),
        ],
        faq=[
            ("Can I use my own custom watermark text?", "Yes — type any text you like; common examples are CONFIDENTIAL, DRAFT, or SAMPLE."),
            ("Can I adjust how visible the watermark is?", "Yes — you can set the opacity, color, and font size before applying it."),
            ("Does the watermark appear on every page?", "Yes, the watermark is applied consistently across all pages of the document."),
            ("Is Watermark PDF free?", "It's a Pro tool, included with the Pro plan."),
        ],
    ),
]

BY_ID = {t["id"]: t for t in TOOLS}


def esc(s):
    return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;"))


def nav_html():
    return """<nav>
  <a href="/" class="logo">All<em>PDF</em>Stuff</a>
  <ul class="nav-links">
    <li><a href="/#tools">Tools</a></li>
    <li><a href="/#pricing">Pricing</a></li>
    <li><a href="/#how">How it works</a></li>
  </ul>
  <div class="nav-r" id="navAuth">
    <button class="btn-ghost" onclick="openModal('login')">Sign in</button>
    <a href="/#pricing" class="btn-pill">Get Pro →</a>
  </div>
  <button class="hamburger" id="hamburger" onclick="toggleMobileMenu()" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
</nav>

<div class="mob-menu" id="mobMenu">
  <a href="/#tools" onclick="closeMobileMenu()">Tools</a>
  <a href="/#pricing" onclick="closeMobileMenu()">Pricing</a>
  <a href="/#how" onclick="closeMobileMenu()">How it works</a>
  <a href="#" onclick="closeMobileMenu();openModal('login')">Sign in</a>
  <a href="/#pricing" onclick="closeMobileMenu()" style="color:var(--or);font-weight:700">Get Pro →</a>
</div>
"""


def footer_html():
    return """<footer>
  <div class="ft-top">
    <div class="ft-brand">
      <a href="/" class="ft-logo">All<em>PDF</em>Stuff</a>
      <p>The fastest, simplest way to work with PDFs online. Professional tools for everyone, right in your browser.</p>
      <a href="https://saasbrowser.com/en/saas/1517856/allpdfstuff" target="_blank" rel="noopener" style="display:inline-block;margin-top:16px"><img src="https://static-files.saasbrowser.com/saas-browser-badge-16.svg" alt="AllPDFStuff - SaaS database" width="200" /></a>
    </div>
    <div class="ft-col"><h4>Tools</h4><ul><li><a href="/compress-pdf.html">Compress PDF</a></li><li><a href="/merge-pdf.html">Merge PDF</a></li><li><a href="/split-pdf.html">Split PDF</a></li><li><a href="/extract-text-from-pdf.html">Extract Text</a></li><li><a href="/pdf-to-jpg.html">PDF to JPG</a></li></ul></div>
    <div class="ft-col"><h4>Company</h4><ul><li><a href="/about.html">About</a></li><li><a href="/#pricing">Pricing</a></li><li><a href="/blog.html">Blog</a></li><li><a href="/contact.html">Contact</a></li></ul></div>
    <div class="ft-col"><h4>Legal</h4><ul><li><a href="/privacy.html">Privacy Policy</a></li><li><a href="/terms.html">Terms of Service</a></li><li><a href="/cookies.html">Cookie Policy</a></li><li><a href="/privacy.html">GDPR</a></li></ul></div>
  </div>
  <div class="ft-bot"><span>© 2026 AllPDFStuff.com — All rights reserved</span><span>🔒 Files auto-deleted after 1 hour</span></div>
</footer>
"""


def modal_html():
    return """<div class="overlay" id="ov">
  <div class="modal">
    <button class="mx" onclick="closeModal()">×</button>
    <div id="lpane">
      <h2>Welcome back</h2>
      <p class="sub">Sign in to your AllPDFStuff account</p>
      <div class="al al-ok" id="lok"></div><div class="al al-err" id="lerr"></div>
      <div class="fld"><label>Email</label><input type="email" id="lem" placeholder="you@example.com"/></div>
      <div class="fld"><label>Password</label><input type="password" id="lpw" placeholder="Your password"/></div>
      <button class="btn-pill" style="width:100%;justify-content:center;font-size:.93rem;padding:12px;margin-top:8px" onclick="doLogin()">Sign In</button>
      <div class="m-note">No account? <a href="#" onclick="sw('signup')">Sign up free</a></div>
      <div class="m-note" style="margin-top:4px"><a href="#" onclick="doForgotPassword()" style="color:#999;font-size:0.82rem">Forgot your password?</a></div>
    </div>
    <div id="spane" style="display:none">
      <h2>Create account</h2>
      <p class="sub">Start using AllPDFStuff for free today</p>
      <div class="al al-ok" id="sok"></div><div class="al al-err" id="serr"></div>
      <div class="fld"><label>Full name</label><input type="text" id="snm" placeholder="Your name"/></div>
      <div class="fld"><label>Email</label><input type="email" id="sem" placeholder="you@example.com"/></div>
      <div class="fld"><label>Password</label><input type="password" id="spw" placeholder="Min. 8 characters"/></div>
      <div style="display:flex;align-items:flex-start;gap:10px;margin:12px 0 4px">
        <input type="checkbox" id="smarketing" style="margin-top:3px;accent-color:var(--or);width:15px;height:15px;flex-shrink:0;cursor:pointer"/>
        <label for="smarketing" style="font-size:.8rem;color:var(--mut2);line-height:1.5;cursor:pointer">Yes, I'd like to receive updates about new features and tips from AllPDFStuff. You can unsubscribe at any time.</label>
      </div>
      <button class="btn-pill" style="width:100%;justify-content:center;font-size:.93rem;padding:12px;margin-top:8px" onclick="doSignup()">Create Free Account</button>
      <div class="m-note">Already have an account? <a href="#" onclick="sw('login')">Sign in</a></div>
    </div>
  </div>
</div>

<div class="toast" id="tst"><span id="tmsg"></span></div>
"""


def upload_widget_html(t):
    watermark_panel = ""
    if t["id"] == "watermark":
        watermark_panel = """
    <div id="watermarkPanel" style="display:none;background:var(--bg);border:1px solid var(--bdr);border-radius:20px;padding:28px;margin-bottom:24px;box-shadow:var(--shadow-lg)">
      <p style="font-family:var(--serif);font-size:1.3rem;font-weight:600;font-style:italic;margin-bottom:18px;text-align:center">💧 Add Watermark to <span style="color:var(--or)" id="wmFileName">your file</span></p>
      <div style="max-width:420px;margin:0 auto">
        <div style="margin-bottom:14px">
          <label style="display:block;font-size:.8rem;font-weight:600;color:var(--mut2);margin-bottom:6px;letter-spacing:.02em">WATERMARK TEXT</label>
          <input id="wmText" type="text" value="CONFIDENTIAL" placeholder="e.g. CONFIDENTIAL, DRAFT, SAMPLE" style="width:100%;background:var(--bg2);border:1px solid var(--bdr);color:var(--txt);padding:12px 15px;border-radius:11px;font-family:var(--sans);font-size:.95rem;outline:none;box-sizing:border-box"/>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
          <div>
            <label style="display:block;font-size:.8rem;font-weight:600;color:var(--mut2);margin-bottom:6px;letter-spacing:.02em">TEXT COLOUR</label>
            <input id="wmColor" type="color" value="#FF0000" style="width:100%;height:42px;border:1px solid var(--bdr);border-radius:11px;background:var(--bg2);cursor:pointer;padding:4px"/>
          </div>
          <div>
            <label style="display:block;font-size:.8rem;font-weight:600;color:var(--mut2);margin-bottom:6px;letter-spacing:.02em">FONT SIZE</label>
            <input id="wmSize" type="number" value="40" min="10" max="100" style="width:100%;background:var(--bg2);border:1px solid var(--bdr);color:var(--txt);padding:12px 15px;border-radius:11px;font-family:var(--sans);font-size:.95rem;outline:none;box-sizing:border-box"/>
          </div>
        </div>
        <div style="margin-bottom:20px">
          <label style="display:block;font-size:.8rem;font-weight:600;color:var(--mut2);margin-bottom:6px;letter-spacing:.02em">OPACITY: <span id="wmOpacityVal">50</span>%</label>
          <input id="wmOpacity" type="range" min="10" max="90" value="50" oninput="document.getElementById('wmOpacityVal').textContent=this.value" style="width:100%;accent-color:var(--or)"/>
        </div>
        <div style="display:flex;gap:10px">
          <button onclick="applyWatermark()" style="flex:1;background:var(--or);color:#fff;border:none;padding:13px;border-radius:100px;font-family:var(--sans);font-size:.9rem;font-weight:700;cursor:pointer">💧 Apply Watermark</button>
          <button onclick="cancelWatermark()" style="background:var(--bg2);color:var(--txt);border:1px solid var(--bdr);padding:13px 20px;border-radius:100px;font-family:var(--sans);font-size:.9rem;cursor:pointer">Cancel</button>
        </div>
      </div>
    </div>
"""
    accept = ".pdf"
    if t["id"] == "convert-image":
        accept = ".jpg,.jpeg,.png,.tiff,.gif,.bmp"
    elif t["id"] == "word-to-pdf":
        accept = ".doc,.docx"
    multiple_hint = "or click to browse"
    if t["id"] == "merge":
        multiple_hint = "or click to browse · <strong>drop 2 or more files to merge</strong>"

    return f"""<div class="up-wrap" id="upload">
  <div class="up-inner">
    <div class="sec-eye" style="justify-content:center">Use this tool</div>
    <h2 class="sec-h" style="text-align:center;margin-bottom:10px">Drop your file &amp; <em>go</em></h2>
    <p class="sec-sub" style="text-align:center;margin:0 auto 36px">Free account required · files auto-delete after 1 hour.</p>
{watermark_panel}
    <div class="drop" id="dropZ" onclick="document.getElementById('fileInput').click()" ondragover="onOver(event)" ondragleave="onLeave()" ondrop="onDrop(event)">
      <div class="drop-ico">{t['icon']}</div>
      <h3 id="dropT">Drop your file here to get started</h3>
      <p id="dropD">{multiple_hint}<br/><small style="font-size:.76rem;color:var(--mut)">Max 10 MB free · 100 MB Pro</small></p>
      <button class="btn-pill" style="pointer-events:none">Choose File</button>
      <input type="file" id="fileInput" accept="{accept}" onchange="onSel(event)" multiple />
    </div>
    <div class="proc" id="procW">
      <div class="spin"></div>
      <h3>Processing your file…</h3>
      <p>This usually takes just a few seconds</p>
    </div>
    <div class="res" id="resW">
      <div class="res-ico">✅</div>
      <h3>Done! Your file is ready</h3>
      <p>Your processed file has been prepared for download</p>
      <div class="res-btns">
        <a id="dlBtn" href="#" class="btn-pill" download style="font-size:.93rem;padding:12px 26px">⬇︎ Download</a>
        <button class="btn-ghost" onclick="resetUp()">Process another</button>
      </div>
    </div>
  </div>
</div>
"""


def other_tools_html(current_id):
    others = [t for t in TOOLS if t["id"] != current_id]
    idx = [t["id"] for t in TOOLS].index(current_id)
    picks = (others * 2)[idx:idx + 6][:6]
    cards = []
    for t in picks:
        tag_class = "tag-f" if t["badge"] == "Free" else "tag-p"
        cards.append(f"""    <a href="/{t['slug']}.html" class="t-card">
      <div class="t-ico">{t['icon']}</div>
      <div class="t-name">{t['name']}</div>
      <div class="t-desc">{esc(t['meta'][:70])}…</div>
      <div class="t-foot"><span class="tag {tag_class}">{t['badge']}</span><div class="t-arr">↗</div></div>
    </a>""")
    return """<div class="sec">
  <div class="sec-eye">More tools</div>
  <h2 class="sec-h">Explore <em>other tools</em></h2>
  <p class="sec-sub">All 15 PDF tools live in one place — browser-based, fast, and free to start.</p>
  <div class="tools-grid" style="grid-template-columns:repeat(3,1fr)">
""" + "\n".join(cards) + """
  </div>
  <p style="margin-top:28px"><a href="/#tools" class="btn-ghost">View all 15 tools →</a></p>
</div>
"""


def faq_schema(t):
    entities = []
    for q, a in t["faq"]:
        entities.append({
            "@type": "Question",
            "name": q,
            "acceptedAnswer": {"@type": "Answer", "text": a},
        })
    schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": entities,
    }
    return json.dumps(schema, indent=2)


def page_html(t):
    url = f"{SITE_URL}/{t['slug']}.html"
    tag_class = "tag-f" if t["badge"] == "Free" else "tag-p"

    features_html = "\n".join(f"""    <div class="feat-card">
      <div class="f-ico">{icon}</div>
      <h3>{esc(title)}</h3>
      <p>{esc(desc)}</p>
    </div>""" for icon, title, desc in t["features"])

    faq_html = "\n".join(f"""    <details class="faq-item">
      <summary>{esc(q)}</summary>
      <p>{esc(a)}</p>
    </details>""" for q, a in t["faq"])

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{esc(t['title'])}</title>
  <meta name="description" content="{esc(t['meta'])}" />
  <link rel="canonical" href="{url}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="{esc(t['title'])}" />
  <meta property="og:description" content="{esc(t['meta'])}" />
  <meta property="og:url" content="{url}" />
  <meta name="twitter:card" content="summary" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Inter:wght@300;400;500;600;700;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/assets/style.css" />

  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%23e8620a'/><text x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' font-size='18' font-family='Georgia,serif' font-style='italic' font-weight='700' fill='white'>P</text></svg>" />

  <!-- Google Analytics GA4 -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZP7PTTQBX6"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){{dataLayer.push(arguments);}}
    gtag('js', new Date());
    gtag('config', 'G-ZP7PTTQBX6');
  </script>

  <script type="application/ld+json">
{faq_schema(t)}
  </script>
</head>
<body>

{nav_html()}

<!-- HERO -->
<section class="hero-tool">
  <div class="hero-ghost">PDF</div>
  <div class="breadcrumb"><a href="/">Home</a><span>/</span><a href="/#tools">Tools</a><span>/</span><span>{esc(t['name'])}</span></div>
  <div class="hero-tool-icon">{t['icon']}</div>
  <h1 class="hero-tool-h">{esc(t['h1_pre'])} <em>{esc(t['h1_em'])}</em></h1>
  <p class="hero-tool-desc">{esc(t['intro'])}</p>
  <div class="hero-tool-tags">
    <span class="tag {tag_class}">{t['badge']}</span>
    <a href="#upload" class="btn-pill" style="font-size:.9rem">Use {esc(t['name'])} now →</a>
  </div>
</section>

<!-- FEATURES -->
<div class="sec" style="padding-top:0">
  <div class="feat-grid">
{features_html}
  </div>
</div>

<!-- UPLOAD -->
{upload_widget_html(t)}

<!-- HOW -->
<div class="how-wrap" id="how">
  <div class="how-inner">
    <div class="sec-eye">How it works</div>
    <h2 class="sec-h" style="text-align:center">Three steps.<br/><em>That's all it takes.</em></h2>
    <div class="how-steps">
      <div class="how-step">
        <div class="how-icon-wrap"><span class="how-step-num">1</span><span class="how-icon">🎯</span></div>
        <h3>Create a free account</h3>
        <p>Sign up in seconds — no credit card required to get started.</p>
        <span class="how-tag">Free to start</span>
      </div>
      <div class="how-step">
        <div class="how-icon-wrap"><span class="how-step-num">2</span><span class="how-icon">📂</span></div>
        <h3>Drop your file</h3>
        <p>Drag and drop or click to browse. Files up to 10 MB are free; Pro unlocks 100 MB.</p>
        <span class="how-tag">Works in your browser</span>
      </div>
      <div class="how-step">
        <div class="how-icon-wrap"><span class="how-step-num">3</span><span class="how-icon">⚡</span></div>
        <h3>Download instantly</h3>
        <p>Your file is processed in seconds. All files are automatically deleted after 1 hour.</p>
        <span class="how-tag">Auto-deleted in 1hr</span>
      </div>
    </div>
  </div>
</div>

<!-- FAQ -->
<div class="sec">
  <div class="sec-eye">FAQ</div>
  <h2 class="sec-h">Common <em>questions</em></h2>
  <div class="faq-list">
{faq_html}
  </div>
</div>

<!-- OTHER TOOLS -->
{other_tools_html(t['id'])}

<!-- CTA -->
<div class="cta">
  <div class="cta-l">
    <h2>Need more than {esc(t['name'])}?</h2>
    <p>Get all 15 PDF tools, 100&nbsp;MB uploads, and 50 tasks a month with Pro.</p>
  </div>
  <a href="/#pricing" class="btn-pill" style="font-size:.97rem;padding:14px 32px;flex-shrink:0">See pricing →</a>
</div>

{footer_html()}

{modal_html()}

<script src="https://js.stripe.com/v3/"></script>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="/assets/app.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {{
    initToolPage('{t["id"]}');
  }});
</script>
</body>
</html>
"""


def main():
    for t in TOOLS:
        path = os.path.join(OUT_DIR, f"{t['slug']}.html")
        with open(path, "w", encoding="utf-8") as f:
            f.write(page_html(t))
        print("wrote", path)


if __name__ == "__main__":
    main()
