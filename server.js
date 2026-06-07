// ─────────────────────────────────────────────────────────────────────────────
// Corestack Technologies — Express + Supabase backend
// Run: npm start   (or: npm run dev  for auto-restart on file changes)
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const { createClient } = require('@supabase/supabase-js');

// ── Supabase client ───────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ── Express app ───────────────────────────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies and allow cross-origin requests from the HTML file
app.use(express.json());
app.use(cors());

// Serve static files (index.html, icon, etc.) so you can open the site via
// http://localhost:3000 instead of the file:// protocol
app.use(express.static(__dirname));

// ── POST /api/contact ─────────────────────────────────────────────────────────
// Receives the contact form, validates it, and inserts a row into Supabase.
app.post('/api/contact', async (req, res) => {
  const { name, email, company, service, message } = req.body;

  // Basic validation — name and email are required
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required.' });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  // Insert lead into Supabase
  const { error } = await supabase.from('leads').insert({
    name:    name.trim(),
    email:   email.trim().toLowerCase(),
    company: company?.trim() || null,
    service: service?.trim() || null,
    message: message?.trim() || null,
  });

  if (error) {
    console.error('Supabase insert error:', error.message);
    return res.status(500).json({ error: 'Could not save your enquiry. Please try again.' });
  }

  console.log(`New lead: ${name} <${email}>`);
  return res.status(201).json({ success: true, message: 'Enquiry received — we\'ll be in touch soon!' });
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Corestack backend running → http://localhost:${PORT}`);
  console.log(`Health check            → http://localhost:${PORT}/api/health`);
});
