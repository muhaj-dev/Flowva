import { supabase } from '../lib/supabase';
import type { Reward, RewardFilter } from '../types';

export const rewardsService = {
  // Get all rewards
  async getAllRewards(): Promise<Reward[]> {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get rewards by filter (sync version with rewards array)
  getRewardsByFilter(filter: RewardFilter, userPoints: number, rewards: Reward[]): Reward[] {
    switch (filter) {
      case 'unlocked':
        return rewards.filter(
          (r) => r.point_cost <= userPoints && r.status !== 'coming_soon'
        );
      case 'locked':
        return rewards.filter(
          (r) => r.point_cost > userPoints && r.status !== 'coming_soon'
        );
      case 'coming_soon':
        return rewards.filter((r) => r.status === 'coming_soon');
      default:
        return rewards;
    }
  },

  // Redeem a reward
  async redeemReward(userId: string, rewardId: string) {
    const { data, error } = await supabase.rpc('redeem_reward', {
      user_id: userId,
      reward_id: rewardId,
    });

    if (error) throw error;
    return data;
  },

  // Get user's redeemed rewards
  async getUserRewards(userId: string) {
    const { data, error } = await supabase
      .from('user_rewards')
      .select('*, rewards(*)')
      .eq('user_id', userId)
      .order('redeemed_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Check if reward is unlocked for user
  isRewardUnlocked(reward: Reward, userPoints: number): boolean {
    return reward.point_cost <= userPoints && reward.status !== 'coming_soon';
  },

  // Get reward counts by filter
  getRewardCounts(rewards: Reward[], userPoints: number) {
    return {
      all: rewards.length,
      unlocked: rewards.filter(
        (r) => r.point_cost <= userPoints && r.status !== 'coming_soon'
      ).length,
      locked: rewards.filter(
        (r) => r.point_cost > userPoints && r.status !== 'coming_soon'
      ).length,
      coming_soon: rewards.filter((r) => r.status === 'coming_soon').length,
    };
  },
};
