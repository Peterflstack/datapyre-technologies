-- ─────────────────────────────────────────────────────────────────────────────
-- Corestack Technologies — Supabase schema
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS leads (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  company     TEXT,
  service     TEXT,
  message     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookups by email and date
CREATE INDEX IF NOT EXISTS leads_email_idx      ON leads (email);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);

-- Optional: enable Row Level Security (recommended for production)
-- ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
-- Then create a policy that allows only your service-role key to read rows.


-- ─────────────────────────────────────────────────────────────────────────────
-- CMS: posts table
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS posts (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT        NOT NULL,
  slug           TEXT        UNIQUE NOT NULL,
  category       TEXT,
  tags           TEXT,
  featured_image TEXT,
  excerpt        TEXT,
  content        TEXT,
  status         TEXT        NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS posts_status_idx     ON posts (status);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts (created_at DESC);
CREATE INDEX IF NOT EXISTS posts_slug_idx       ON posts (slug);

-- Auto-update updated_at on every row update
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS posts_updated_at ON posts;
CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ─────────────────────────────────────────────────────────────────────────────
-- CMS: settings table  (key-value store)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS settings (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  key        TEXT        UNIQUE NOT NULL,
  value      TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default settings (safe to run multiple times)
INSERT INTO settings (key, value) VALUES
  ('whatsapp_number', '254700000000'),
  ('contact_email',   'hello@corestack.co.ke'),
  ('tagline',         'Performance, Built In Layers'),
  ('social_linkedin', ''),
  ('social_twitter',  ''),
  ('social_instagram',''),
  ('social_facebook', '')
ON CONFLICT (key) DO NOTHING;
