export interface User {
  id: string;
  email: string;
  points_balance: number;
  daily_streak: number;
  last_check_in: string | null;
  referral_code: string | null;
  referred_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string | null;
  point_cost: number;
  category: 'gift_card' | 'cash' | 'course' | 'other' | null;
  status: 'locked' | 'unlocked' | 'coming_soon';
  image_url: string | null;
  emoji: string | null;
  redemption_type: string | null;
  created_at: string;
  order_index: number;
}

export interface UserReward {
  id: string;
  user_id: string;
  reward_id: string;
  redeemed_at: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  points_spent: number;
}

export interface Activity {
  id: string;
  user_id: string;
  activity_type: 'daily_checkin' | 'task_completion' | 'reward_redemption' | 'referral' | 'signup_bonus';
  points_earned: number;
  points_spent: number;
  description: string | null;
  metadata: any;
  created_at: string;
}

export interface Task {
  id: string;
  name: string;
  description: string | null;
  points_reward: number;
  requirements: {
    needs_email?: boolean;
    needs_screenshot?: boolean;
    needs_verification?: boolean;
  } | null;
  status: 'active' | 'inactive' | 'coming_soon';
  button_text: string | null;
  external_link: string | null;
  image_url: string | null;
  created_at: string;
}

export interface UserTask {
  id: string;
  user_id: string;
  task_id: string;
  submission_data: {
    email?: string;
    screenshot_url?: string;
  } | null;
  status: 'pending' | 'submitted' | 'verified' | 'rejected';
  verified_at: string | null;
  points_awarded: boolean;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referee_id: string;
  status: 'pending' | 'completed' | 'failed';
  points_awarded: boolean;
  created_at: string;
  completed_at: string | null;
}

export type RewardFilter = 'all' | 'unlocked' | 'locked' | 'coming_soon';

export interface ReferralStats {
  totalReferrals: number;
  pointsEarned: number;
}
