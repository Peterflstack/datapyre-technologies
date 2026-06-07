const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    // Vercel may not auto-parse the body — handle both cases
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    }
    if (!body || typeof body !== 'object') {
      body = {};
    }

    const { name, email, company, service, message } = body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: 'Name is required.' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    const { error } = await supabase.from('leads').insert({
      name:    String(name).trim(),
      email:   String(email).trim().toLowerCase(),
      company: company ? String(company).trim() : null,
      service: service ? String(service).trim() : null,
      message: message ? String(message).trim() : null,
    });

    if (error) {
      console.error('Supabase insert error:', error.message);
      return res.status(500).json({ error: 'Could not save your enquiry. Please try again.' });
    }

    return res.status(200).json({ success: true, message: "Enquiry received — we'll be in touch soon!" });

  } catch (err) {
    console.error('Unhandled error in /api/contact:', err.message);
    return res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
  }
};
