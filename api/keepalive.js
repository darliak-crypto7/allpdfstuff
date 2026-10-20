// Supabase keepalive - called by Vercel Cron (see vercel.json "crons").
// Runs one tiny read query so the free-tier project never counts as inactive.
export default async function handler(req, res) {
  // If CRON_SECRET is set in Vercel, Vercel sends it automatically on cron calls.
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }

  const url = process.env.SUPABASE_URL || 'https://pzimfguaqqcktokwwdeq.supabase.co';
  // Public anon key is fine here: it only reads approved reviews (allowed by RLS).
  const key = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6aW1mZ3VhcXFja3Rva3d3ZGVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3OTQ4MTEsImV4cCI6MjA4OTM3MDgxMX0.OoxZQ4J0xltJYsa6T7Z0IlCueZGHgvEF97EJDO3LUaY';
  if (!key) return res.status(500).json({ ok: false, error: 'missing key' });

  try {
    const r = await fetch(`${url}/rest/v1/reviews?select=id&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!r.ok) return res.status(502).json({ ok: false, status: r.status });
    return res.status(200).json({ ok: true, at: new Date().toISOString() });
  } catch (e) {
    return res.status(502).json({ ok: false, error: String(e) });
  }
}
