# Visual Learn 🎓

Learn anything visually — type any topic, get an instant diagram + explanation.

## Quick Setup (5 minutes)

### 1. Install dependencies
```bash
npm install
```

### 2. Add your API keys to `.env.local`
Open `.env.local` and fill in:

```env
GEMINI_API_KEY=your_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Get Gemini API key (free):**
→ Go to https://aistudio.google.com
→ Click "Get API Key" → Create API key → Copy it

**Get Supabase keys (free):**
→ Go to https://supabase.com → New project
→ Settings → API → copy "Project URL" and "anon public" key

### 3. Create the Supabase table
In your Supabase dashboard → SQL Editor → run:

```sql
create table visuals (
  id uuid default gen_random_uuid() primary key,
  topic text not null unique,
  data jsonb not null,
  created_at timestamp default now()
);
```

### 4. Run it
```bash
npm run dev
```

Open http://localhost:3000 — type any topic and hit Visualise!

---

## How it works

1. User types a topic (e.g. "photosynthesis")
2. Topic is normalized and checked in Supabase cache
3. If cached → returned instantly (0 tokens)
4. If new → Gemini Flash generates a diagram JSON
5. Result is cached in Supabase for future users
6. SVG diagram renders in the browser

## Project Structure

```
visual-learn/
├── app/
│   ├── page.tsx              ← Home page
│   ├── layout.tsx            ← Root layout
│   ├── globals.css           ← Global styles
│   └── api/generate/
│       └── route.ts          ← Main API endpoint
├── components/
│   ├── SearchBox.tsx         ← Input UI
│   ├── VisualCard.tsx        ← SVG diagram renderer
│   └── LoadingState.tsx      ← Loading skeleton
├── lib/
│   ├── gemini.ts             ← AI call logic
│   └── supabase.ts           ← Database client
└── .env.local                ← Your API keys (never commit)
```

## Deploy to Vercel (free)

```bash
npm install -g vercel
vercel
```

Add your env variables in Vercel dashboard → Settings → Environment Variables.
