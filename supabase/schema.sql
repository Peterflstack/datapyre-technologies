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
