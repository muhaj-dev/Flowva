# FlowvaHub Rewards System - Setup Guide

## 🚀 Quick Start

Follow these steps to get your Rewards Hub up and running.

---

## Step 1: Install Dependencies

```bash
cd rewards-hub
npm install
```

---

## Step 2: Set Up Supabase

### 2.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in your project details:
   - **Name**: FlowvaHub (or your choice)
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
4. Click "Create new project" and wait for it to initialize

### 2.2 Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open the file `supabase/schema.sql` in this project
4. Copy **ALL** the contents (it's a long file!)
5. Paste it into the Supabase SQL Editor
6. Click **Run** (or press Ctrl/Cmd + Enter)
7. You should see "Success" messages

This will create:
- ✅ All 7 database tables
- ✅ RLS (Row Level Security) policies
- ✅ PostgreSQL functions for points, streaks, and redemptions
- ✅ Sample reward data
- ✅ Automatic triggers

### 2.3 Create Storage Bucket for Screenshots

1. In Supabase dashboard, go to **Storage**
2. Click **New Bucket**
3. Bucket name: `task-submissions`
4. Set to **Private**
5. Click **Create Bucket**

### 2.4 Add Storage Policies

Go back to **SQL Editor** and run this:

```sql
-- Allow users to upload to their own folder
CREATE POLICY "Users can upload task submissions"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'task-submissions' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to read their own uploads
CREATE POLICY "Users can read own task submissions"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'task-submissions' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## Step 3: Configure Environment Variables

### 3.1 Get Your Supabase Credentials

1. In Supabase dashboard, go to **Settings** (gear icon) → **API**
2. Find these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### 3.2 Update .env File

Open the `.env` file in the root of `rewards-hub/` and update:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-actual-key-here
VITE_SITE_URL=http://localhost:5173
```

**⚠️ Important**:
- Replace `your-project-id` with your actual Supabase project ID
- Replace the anon key with your actual key from Supabase
- Don't commit this file to Git (it's in .gitignore)

---

## Step 4: Run the Development Server

```bash
npm run dev
```

You should see:

```
  VITE v7.3.0  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open [http://localhost:5173](http://localhost:5173) in your browser!

---

## Step 5: Create a Test Account

Since this is a fresh setup, you'll need to create a user account:

### Option A: Using Supabase Dashboard

1. Go to **Authentication** → **Users** in Supabase
2. Click **Add User**
3. Choose **Email** tab
4. Enter email: `test@example.com`
5. Enter password: `password123`
6. Uncheck "Auto Confirm User"
7. Click **Create User**

### Option B: Update Auth to Auto-Confirm (Recommended for Testing)

In Supabase dashboard:
1. Go to **Authentication** → **Providers**
2. Click on **Email**
3. Toggle **Enable email confirmations** to OFF
4. Click **Save**

Now you can sign up directly in the app without email confirmation!

---

## Step 6: Sign In and Test

1. Open the app at `http://localhost:5173`
2. You should see the Rewards Hub page
3. If you see "Please sign in", the app is working but needs authentication

### Temporary: Mock Sign In

Since we haven't built the sign-in page yet, let's add a temporary helper.

Create a test user directly in Supabase:

1. Go to **SQL Editor**
2. Run this to create a test user:

```sql
-- First, create an auth user (replace with your desired email/password)
-- Note: You'll need to sign up through Supabase Auth UI or use signUp function

-- Then insert the user profile (replace USER_ID with actual UUID from auth.users)
INSERT INTO public.users (id, email, points_balance, daily_streak)
VALUES (
  'your-user-id-from-auth-users',  -- Get this from auth.users table
  'test@example.com',
  10,
  0
);
```

**Better approach**: Use the Supabase dashboard to create the auth user first, then run the profile insert.

---

## 🎨 Customizing Colors

All colors are defined in `src/index.css`. Change these CSS variables:

```css
:root {
  --color-primary: #9013fe;        /* Main purple */
  --color-primary-hover: #8628da;  /* Hover state */
  --color-secondary: #70D6FF;      /* Cyan accent */
  /* ... change any color here! */
}
```

---

## 📦 Project Structure

```
rewards-hub/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable components (Button, Card, Modal, Tabs)
│   │   └── rewards/         # Rewards-specific components
│   ├── contexts/            # React Context (Auth)
│   ├── hooks/               # Custom hooks (coming soon)
│   ├── lib/                 # Supabase client
│   ├── pages/               # Main pages (RewardsHub)
│   ├── services/            # API services (auth, users, rewards, tasks)
│   ├── types/               # TypeScript types
│   └── utils/               # Utility functions
├── supabase/
│   └── schema.sql           # Complete database schema
└── .env                     # Environment variables (YOU NEED TO UPDATE THIS!)
```

---

## 🐛 Troubleshooting

### "Missing Supabase environment variables"

**Fix**: Make sure you updated the `.env` file with your actual Supabase URL and anon key.

### "Failed to fetch rewards" or similar errors

**Fix**:
1. Check that you ran the entire `schema.sql` in Supabase
2. Verify RLS policies are created (check **Database** → **Policies**)
3. Make sure you're signed in with a valid user

### Can't upload screenshots

**Fix**:
1. Verify the `task-submissions` bucket exists
2. Check that storage policies are applied
3. Bucket must be set to **Private**

### "CORS error" or "Network error"

**Fix**:
1. Verify your Supabase URL is correct in `.env`
2. Make sure your Supabase project is active (not paused)
3. Check Supabase dashboard for any service issues

---

## ✅ Features Checklist

After setup, test these features:

- [ ] Points balance displays correctly
- [ ] Daily check-in works (click "Check In" button)
- [ ] Streak increments after check-in
- [ ] Can view all rewards in grid
- [ ] Can filter rewards (Unlocked, Locked, Coming Soon)
- [ ] Can click "Claim 50 pts" and submit screenshot
- [ ] Referral link shows correct code
- [ ] Can copy referral link
- [ ] Social share buttons work
- [ ] Sidebar navigation works on mobile

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SITE_URL` (set to your production URL)
6. Click "Deploy"

### Deploy to Netlify

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import from Git"
4. Select your repository
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Add environment variables in Site Settings
8. Click "Deploy"

---

## 📝 Next Steps

1. **Add Authentication UI**: Build sign-in and sign-up pages
2. **Admin Panel**: Create interface to verify task submissions
3. **Email Notifications**: Set up Supabase email templates
4. **Analytics**: Track user engagement
5. **More Rewards**: Add more reward options in database

---

## 🆘 Need Help?

- Check the main `README.md` for architecture details
- Review `supabase/schema.sql` for database structure
- Inspect browser console for errors
- Check Supabase dashboard logs

---

## 🎉 You're Done!

Your FlowvaHub Rewards System is now ready to use! Start earning points and redeeming rewards!
