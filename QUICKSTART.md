# ⚡ Quick Start - 5 Minutes to Running

## Step 1: Create Supabase Project (2 min)

1. Go to https://supabase.com → Sign in → New Project
2. Name: `FlowvaHub`, Password: (choose one), Region: (closest to you)
3. Wait for project to initialize

## Step 2: Setup Database (1 min)

1. Click **SQL Editor** in sidebar
2. Copy ALL of `supabase/schema.sql` from this project
3. Paste into SQL Editor → Click **Run**
4. Should see "Success" messages

## Step 3: Create Storage Bucket (30 sec)

1. Click **Storage** in sidebar → **New Bucket**
2. Name: `task-submissions`, Privacy: **Private**
3. Click **Create**

## Step 4: Add Storage Policies (30 sec)

Go back to **SQL Editor**, paste and run:

```sql
CREATE POLICY "Users can upload task submissions"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'task-submissions' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can read own task submissions"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'task-submissions' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

## Step 5: Get API Keys (30 sec)

1. Go to **Settings** (gear icon) → **API**
2. Copy:
   - **Project URL**: `https://xxx.supabase.co`
   - **anon public key**: `eyJhbGci...`

## Step 6: Configure Environment (30 sec)

Edit `.env` file in project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-key-here
VITE_SITE_URL=http://localhost:5173
```

## Step 7: Run! (30 sec)

```bash
npm run dev
```

Open http://localhost:5173

## 🎉 Done!

You should see the Rewards Hub page!

---

## Need a Test User?

### Option 1: Disable Email Confirmation (Fastest)
1. Supabase → **Authentication** → **Providers** → **Email**
2. Toggle OFF "Enable email confirmations"
3. Save → Now you can sign up in the app!

### Option 2: Create Manually
1. Supabase → **Authentication** → **Users** → **Add User**
2. Email: `test@example.com`, Password: `password123`
3. Create → Use these credentials in app

---

## 🐛 Issues?

**"Missing Supabase environment variables"**
→ Check your `.env` file has correct URL and key

**"Network error"**
→ Verify Supabase project is running (not paused)

**Can't sign in**
→ Create a user in Supabase dashboard first

---

## 📚 Full Documentation

- `SETUP.md` - Detailed setup guide
- `PROJECT_SUMMARY.md` - Complete feature list
- `supabase/schema.sql` - Database structure

Enjoy your Rewards Hub! 🚀
