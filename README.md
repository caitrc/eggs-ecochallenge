# 🥚🌿 EGGS EcoChallenge

A school eco challenge website for Epsom Girls Grammar School, running April 22 – May 22.

---

## Step-by-step setup guide

### Step 1 — Set up Supabase (your database)

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New project**, give it a name like `eggs-ecochallenge`, set a password, choose a region (Australia is closest to NZ)
3. Wait ~2 minutes for it to set up
4. Go to **SQL Editor** (left sidebar)
5. Paste the contents of `supabase-setup.sql` and click **Run**
6. Go to **Settings → API** and copy:
   - **Project URL** (looks like `https://abcdef.supabase.co`)
   - **anon public** key (long string of letters)

### Step 2 — Connect your project to Supabase

1. In VS Code, open this project folder
2. Copy the file `.env.local.example` and rename the copy to `.env.local`
3. Replace the placeholder values with your real URL and key:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-real-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-real-anon-key
```

### Step 3 — Run it locally to test

Open a terminal in VS Code (`Terminal → New Terminal`) and run:

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser. 🎉

### Step 4 — Put it on the internet with Vercel

1. Go to [github.com](https://github.com) and create a **New repository** called `eggs-ecochallenge`
2. In VS Code terminal:
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/eggs-ecochallenge.git
git push -u origin main
```
3. Go to [vercel.com](https://vercel.com), click **Add New Project**, and import your GitHub repo
4. Under **Environment Variables**, add your two Supabase variables
5. Click **Deploy** — in ~1 minute you'll get a URL like `eggs-ecochallenge.vercel.app`!

---

## Customising the site

- **Tutor classes**: Edit the `TUTOR_CLASSES` list in `src/app/login/page.tsx`
- **Team names**: Edit the INSERT statements at the bottom of `supabase-setup.sql` (or add them directly in Supabase's Table Editor)
- **Challenges**: Edit `src/lib/challenges.ts` to add/remove challenges
- **School colours**: Edit `tailwind.config.js` to change the green colour scheme

---

## Questions?

Ask Claude at [claude.ai](https://claude.ai) — paste your error message and it'll help you fix it!
