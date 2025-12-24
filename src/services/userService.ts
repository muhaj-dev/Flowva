import { supabase } from '../lib/supabase';
import type { User } from '../types';

export const userService = {
  // Get user profile
  async getUserProfile(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user activities
  async getUserActivities(userId: string) {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data;
  },

  // Check if user can check in today
  async canCheckInToday(userId: string): Promise<boolean> {
    const user = await this.getUserProfile(userId);
    if (!user) return false;

    if (!user.last_check_in) return true;

    const today = new Date().toISOString().split('T')[0];
    return user.last_check_in !== today;
  },

  // Daily check-in
  async dailyCheckIn(userId: string) {
    const { data, error } = await supabase.rpc('handle_daily_checkin', {
      user_id: userId,
    });

    if (error) throw error;
    return data; // Returns points awarded (5 or 0)
  },

  // Get referral stats
  async getReferralStats(userId: string) {
    const { data: referrals, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', userId);

    if (error) throw error;

    const totalReferrals = referrals?.length || 0;
    const completedReferrals =
      referrals?.filter((r) => r.status === 'completed').length || 0;
    const pointsEarned = completedReferrals * 25;

    return {
      totalReferrals,
      pointsEarned,
    };
  },

  // Get referral link
  getReferralLink(referralCode: string): string {
    const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
    return `${siteUrl}/signup/?ref=${referralCode}`;
  },
};
