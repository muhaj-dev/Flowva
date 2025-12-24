-- FlowvaHub Rewards System Database Schema
-- Run this in your Supabase SQL Editor

-- =============================================================================
-- 1. USERS TABLE (extends auth.users)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  points_balance INTEGER DEFAULT 10,
  daily_streak INTEGER DEFAULT 0,
  last_check_in DATE,
  referral_code VARCHAR(10) UNIQUE,
  referred_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- 2. REWARDS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  point_cost INTEGER NOT NULL,
  category VARCHAR(50) CHECK (category IN ('gift_card', 'cash', 'course', 'other')),
  status VARCHAR(20) CHECK (status IN ('locked', 'unlocked', 'coming_soon')) DEFAULT 'locked',
  image_url VARCHAR(500),
  emoji VARCHAR(10) DEFAULT '🎁',
  redemption_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  order_index INTEGER DEFAULT 0
);

-- =============================================================================
-- 3. USER REWARDS (Redemption History)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.user_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  reward_id UUID REFERENCES public.rewards(id) ON DELETE CASCADE NOT NULL,
  redeemed_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  points_spent INTEGER NOT NULL,
  UNIQUE(user_id, reward_id)
);

-- =============================================================================
-- 4. USER ACTIVITIES (Points History)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.user_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN (
    'daily_checkin',
    'task_completion',
    'reward_redemption',
    'referral',
    'signup_bonus'
  )),
  points_earned INTEGER DEFAULT 0,
  points_spent INTEGER DEFAULT 0,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- 5. TASKS/CHALLENGES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  points_reward INTEGER NOT NULL,
  requirements JSONB, -- {needs_email: bool, needs_screenshot: bool, needs_verification: bool}
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'coming_soon')),
  button_text VARCHAR(100),
  external_link VARCHAR(500),
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- 6. USER TASK SUBMISSIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.user_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
  submission_data JSONB, -- {email: string, screenshot_url: string}
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'verified', 'rejected')),
  verified_at TIMESTAMP,
  points_awarded BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, task_id)
);

-- =============================================================================
-- 7. REFERRALS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  referee_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  points_awarded BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  UNIQUE(referee_id) -- One user can only be referred once
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON public.users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON public.users(referred_by);
CREATE INDEX IF NOT EXISTS idx_user_rewards_user_id ON public.user_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tasks_user_id ON public.user_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referee_id ON public.referrals(referee_id);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Rewards table policies (public read)
CREATE POLICY "Anyone can view rewards"
  ON public.rewards FOR SELECT
  USING (true);

-- User rewards policies
CREATE POLICY "Users can view own redemptions"
  ON public.user_rewards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own redemptions"
  ON public.user_rewards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User activities policies
CREATE POLICY "Users can view own activities"
  ON public.user_activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own activities"
  ON public.user_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Tasks table policies (public read)
CREATE POLICY "Anyone can view tasks"
  ON public.tasks FOR SELECT
  USING (true);

-- User tasks policies
CREATE POLICY "Users can view own task submissions"
  ON public.user_tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own task submissions"
  ON public.user_tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own task submissions"
  ON public.user_tasks FOR UPDATE
  USING (auth.uid() = user_id);

-- Referrals policies
CREATE POLICY "Users can view own referrals"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referrer_id OR auth.uid() = referee_id);

CREATE POLICY "Users can create referrals"
  ON public.referrals FOR INSERT
  WITH CHECK (auth.uid() = referrer_id);

-- =============================================================================
-- DATABASE FUNCTIONS
-- =============================================================================

-- Function to handle daily check-in
CREATE OR REPLACE FUNCTION handle_daily_checkin(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  current_streak INTEGER;
  last_check_date DATE;
  today_date DATE := CURRENT_DATE;
  points_awarded INTEGER := 5;
BEGIN
  -- Get user's current streak and last check-in
  SELECT daily_streak, last_check_in
  INTO current_streak, last_check_date
  FROM public.users WHERE id = user_id;

  -- Check if already checked in today
  IF last_check_date = today_date THEN
    RETURN 0; -- Already checked in
  END IF;

  -- Calculate new streak
  IF last_check_date IS NULL OR last_check_date < today_date - INTERVAL '1 day' THEN
    -- Streak broken or first time
    current_streak := 1;
  ELSIF last_check_date = today_date - INTERVAL '1 day' THEN
    -- Streak continues
    current_streak := current_streak + 1;
  END IF;

  -- Update user
  UPDATE public.users
  SET daily_streak = current_streak,
      last_check_in = today_date,
      points_balance = points_balance + points_awarded,
      updated_at = NOW()
  WHERE id = user_id;

  -- Log activity
  INSERT INTO public.user_activities (user_id, activity_type, points_earned, description)
  VALUES (user_id, 'daily_checkin', points_awarded, 'Daily check-in streak: ' || current_streak);

  RETURN points_awarded;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to redeem reward
CREATE OR REPLACE FUNCTION redeem_reward(user_id UUID, reward_id UUID)
RETURNS JSON AS $$
DECLARE
  user_points INTEGER;
  reward_cost INTEGER;
  reward_status VARCHAR;
  reward_name VARCHAR;
  result JSON;
BEGIN
  -- Get user points and reward details
  SELECT points_balance INTO user_points FROM public.users WHERE id = user_id;
  SELECT point_cost, status, name INTO reward_cost, reward_status, reward_name FROM public.rewards WHERE id = reward_id;

  -- Check conditions
  IF reward_status != 'unlocked' THEN
    RETURN json_build_object('success', false, 'message', 'Reward is not available');
  END IF;

  IF user_points < reward_cost THEN
    RETURN json_build_object('success', false, 'message', 'Insufficient points');
  END IF;

  -- Check if already redeemed
  IF EXISTS (SELECT 1 FROM public.user_rewards WHERE user_id = user_id AND reward_id = reward_id) THEN
    RETURN json_build_object('success', false, 'message', 'Reward already redeemed');
  END IF;

  -- Deduct points
  UPDATE public.users
  SET points_balance = points_balance - reward_cost,
      updated_at = NOW()
  WHERE id = user_id;

  -- Create redemption record
  INSERT INTO public.user_rewards (user_id, reward_id, points_spent, status)
  VALUES (user_id, reward_id, reward_cost, 'pending');

  -- Log activity
  INSERT INTO public.user_activities (user_id, activity_type, points_spent, description)
  VALUES (user_id, 'reward_redemption', reward_cost, 'Redeemed: ' || reward_name);

  RETURN json_build_object('success', true, 'message', 'Reward redeemed successfully');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to award task points
CREATE OR REPLACE FUNCTION award_task_points(user_id UUID, task_id UUID)
RETURNS JSON AS $$
DECLARE
  task_points INTEGER;
  task_name VARCHAR;
  user_task_status VARCHAR;
BEGIN
  -- Get task details
  SELECT points_reward, name INTO task_points, task_name FROM public.tasks WHERE id = task_id;

  -- Check if task submission exists and is verified
  SELECT status INTO user_task_status FROM public.user_tasks
  WHERE user_id = user_id AND task_id = task_id;

  IF user_task_status IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Task not submitted');
  END IF;

  IF user_task_status != 'verified' THEN
    RETURN json_build_object('success', false, 'message', 'Task not verified yet');
  END IF;

  -- Check if points already awarded
  IF EXISTS (SELECT 1 FROM public.user_tasks WHERE user_id = user_id AND task_id = task_id AND points_awarded = true) THEN
    RETURN json_build_object('success', false, 'message', 'Points already awarded');
  END IF;

  -- Award points
  UPDATE public.users
  SET points_balance = points_balance + task_points,
      updated_at = NOW()
  WHERE id = user_id;

  -- Mark points as awarded
  UPDATE public.user_tasks
  SET points_awarded = true
  WHERE user_id = user_id AND task_id = task_id;

  -- Log activity
  INSERT INTO public.user_activities (user_id, activity_type, points_earned, description)
  VALUES (user_id, 'task_completion', task_points, 'Completed: ' || task_name);

  RETURN json_build_object('success', true, 'message', 'Points awarded successfully', 'points', task_points);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to complete referral
CREATE OR REPLACE FUNCTION complete_referral(referee_id UUID)
RETURNS JSON AS $$
DECLARE
  referrer_id UUID;
  referral_points INTEGER := 25;
BEGIN
  -- Get referrer
  SELECT referred_by INTO referrer_id FROM public.users WHERE id = referee_id;

  IF referrer_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'No referrer found');
  END IF;

  -- Check if referral already completed
  IF EXISTS (SELECT 1 FROM public.referrals WHERE referee_id = referee_id AND status = 'completed') THEN
    RETURN json_build_object('success', false, 'message', 'Referral already completed');
  END IF;

  -- Award points to referrer
  UPDATE public.users
  SET points_balance = points_balance + referral_points,
      updated_at = NOW()
  WHERE id = referrer_id;

  -- Update referral status
  UPDATE public.referrals
  SET status = 'completed',
      points_awarded = true,
      completed_at = NOW()
  WHERE referee_id = referee_id;

  -- Log activity
  INSERT INTO public.user_activities (user_id, activity_type, points_earned, description)
  VALUES (referrer_id, 'referral', referral_points, 'Friend joined via referral');

  RETURN json_build_object('success', true, 'message', 'Referral completed', 'points', referral_points);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate random 8-character code
    new_code := LOWER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));

    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.users WHERE referral_code = new_code) INTO code_exists;

    -- Exit loop if code is unique
    EXIT WHEN NOT code_exists;
  END LOOP;

  RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate referral code on user creation
CREATE OR REPLACE FUNCTION auto_generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_referral_code
BEFORE INSERT ON public.users
FOR EACH ROW
EXECUTE FUNCTION auto_generate_referral_code();

-- =============================================================================
-- SEED DATA - Sample Rewards
-- =============================================================================

INSERT INTO public.rewards (name, description, point_cost, category, status, emoji, order_index) VALUES
('$5 Bank Transfer', 'The $5 equivalent will be transferred to your bank account.', 5000, 'cash', 'locked', '💸', 1),
('$5 PayPal International', 'Receive a $5 PayPal balance transfer directly to your PayPal account email.', 5000, 'cash', 'locked', '💸', 2),
('$5 Virtual Visa Card', 'Use your $5 prepaid card to shop anywhere Visa is accepted online.', 5000, 'gift_card', 'locked', '🎁', 3),
('$5 Apple Gift Card', 'Redeem this $5 Apple Gift Card for apps, games, music, movies, and more on the App Store and iTunes.', 5000, 'gift_card', 'locked', '🎁', 4),
('$5 Google Play Card', 'Use this $5 Google Play Gift Card to purchase apps, games, movies, books, and more on the Google Play Store.', 5000, 'gift_card', 'locked', '🎁', 5),
('$5 Amazon Gift Card', 'Get a $5 digital gift card to spend on your favorite tools or platforms.', 5000, 'gift_card', 'locked', '🎁', 6),
('$10 Amazon Gift Card', 'Get a $10 digital gift card to spend on your favorite tools or platforms.', 10000, 'gift_card', 'locked', '🎁', 7),
('Free Udemy Course', 'Coming Soon!', 0, 'course', 'coming_soon', '📚', 8);

-- =============================================================================
-- SEED DATA - Sample Task (Reclaim Example)
-- =============================================================================

INSERT INTO public.tasks (name, description, points_reward, requirements, status, button_text, external_link) VALUES
('Claim Your 25 Points',
 'Sign up for Reclaim (free, no payment needed), then fill the form below',
 25,
 '{"needs_email": true, "needs_screenshot": true, "needs_verification": true}'::jsonb,
 'active',
 'Claim 50 pts',
 'https://reclaim.ai');

-- =============================================================================
-- STORAGE BUCKET SETUP (Run this in Supabase Dashboard > Storage)
-- =============================================================================
-- Create a bucket called 'task-submissions' for screenshot uploads
-- Set it to private and configure RLS policies for user access
