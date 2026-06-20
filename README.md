# Datapyre Technologies — Website & Backend

## Project structure

```
datapyre-technologies/
├── index.html          # Main website (all HTML/CSS/JS)
├── datapyre_favicon.png  # Site icon / logo mark
├── server.js           # Express API server
├── package.json
├── .env                # Supabase credentials (never commit this)
├── supabase/
│   └── schema.sql      # Run once in Supabase to create the leads table
└── README.md
```

---

## 1 — Set up Supabase (free, takes ~3 minutes)

1. Go to [supabase.com](https://supabase.com) and sign in or create an account.
2. Click **New project**, give it a name (e.g. `datapyre`), choose a region close to Kenya (e.g. `ap-southeast-1 Singapore`), set a database password.
3. Wait ~60 seconds for the project to spin up.
4. In the left sidebar go to **SQL Editor → New query**.
5. Paste the contents of `supabase/schema.sql` and click **Run**. This creates the `leads` table.
6. In the left sidebar go to **Settings → API**.
7. Copy **Project URL** and **anon / public** API key.

---

## 2 — Add credentials to .env

Open `.env` and replace the placeholder values:

```env
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PORT=3000
```

> **Never commit `.env` to Git.** It is listed in `.gitignore` by convention.

---

## 3 — Install dependencies

```bash
npm install
```

---

## 4 — Run the server

```bash
# Production
npm start

# Development (auto-restarts when you save server.js)
npm run dev
```

The server starts at **http://localhost:3000**.  
Open that URL in your browser to see the site (same as opening `index.html` directly).

---

## 5 — Test the contact form

Fill in the form on the site and click **Send enquiry**.  
To verify the lead was saved: Supabase Dashboard → **Table Editor → leads**.

You can also test the API directly:

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","service":"Web Design & Development","message":"Hello"}'
```

Expected response:
```json
{ "success": true, "message": "Enquiry received — we'll be in touch soon!" }
```

---

## 6 — View leads in Supabase

Supabase Dashboard → **Table Editor → leads** shows every submission in real time.  
You can also export as CSV or connect a tool like Retool or Google Sheets.

---

## WhatsApp number & Formspree

- Update `+254 700 000 000` and `254700000000` in `index.html` with the real number.
- The contact form now posts to `/api/contact` (local backend). Formspree is no longer used.
