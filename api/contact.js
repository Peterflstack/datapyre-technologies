const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const { name, email, company, service, message } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required.' });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

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

  return res.status(201).json({ success: true, message: "Enquiry received — we'll be in touch soon!" });
};
