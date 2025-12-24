import React, { useState, useEffect } from 'react';
import { Tabs } from '../ui';
import { RewardCard } from './RewardCard';
import { rewardsService } from '../../services';
import type { Reward, RewardFilter } from '../../types';

interface RewardsGridProps {
  userPoints: number;
  onRewardRedeemed?: () => void;
}

export const RewardsGrid: React.FC<RewardsGridProps> = ({ userPoints, onRewardRedeemed }) => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [filteredRewards, setFilteredRewards] = useState<Reward[]>([]);
  const [filter] = useState<RewardFilter>('all');
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    loadRewards();
  }, []);

  useEffect(() => {
    filterRewards();
  }, [filter, rewards, userPoints]);

  const loadRewards = async () => {
    try {
      const data = await rewardsService.getAllRewards();
      setRewards(data);
    } catch (error) {
      console.error('Error loading rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRewards = () => {
    const filtered = rewardsService.getRewardsByFilter(filter, userPoints, rewards);
    setFilteredRewards(filtered);
  };

  const handleRedeem = async (rewardId: string) => {
    if (redeeming) return;

    const confirmed = window.confirm(
      'Are you sure you want to redeem this reward? Points will be deducted from your balance.'
    );

    if (!confirmed) return;

    setRedeeming(true);

    try {
      const { supabase } = await import('../../lib/supabase');
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert('You must be logged in to redeem rewards');
        return;
      }

      const result: any = await rewardsService.redeemReward(user.id, rewardId);

      if (result.success) {
        alert('✅ Reward redeemed successfully! Your request is being processed.');
        onRewardRedeemed?.();
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (error: any) {
      console.error('Error redeeming reward:', error);
      alert(`Failed to redeem reward: ${error.message}`);
    } finally {
      setRedeeming(false);
    }
  };

  const counts = rewardsService.getRewardCounts(rewards, userPoints);

  const tabs = [
    {
      id: 'all',
      label: 'All Rewards',
      badge: counts.all,
      content: (
        <RewardsGridContent
          rewards={filteredRewards}
          userPoints={userPoints}
          onRedeem={handleRedeem}
          loading={loading}
          redeeming={redeeming}
        />
      ),
    },
    {
      id: 'unlocked',
      label: 'Unlocked',
      badge: counts.unlocked,
      content: (
        <RewardsGridContent
          rewards={filteredRewards}
          userPoints={userPoints}
          onRedeem={handleRedeem}
          loading={loading}
          redeeming={redeeming}
        />
      ),
    },
    {
      id: 'locked',
      label: 'Locked',
      badge: counts.locked,
      content: (
        <RewardsGridContent
          rewards={filteredRewards}
          userPoints={userPoints}
          onRedeem={handleRedeem}
          loading={loading}
          redeeming={redeeming}
        />
      ),
    },
    {
      id: 'coming_soon',
      label: 'Coming Soon',
      badge: counts.coming_soon,
      content: (
        <RewardsGridContent
          rewards={filteredRewards}
          userPoints={userPoints}
          onRedeem={handleRedeem}
          loading={loading}
          redeeming={redeeming}
        />
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-lg md:text-2xl my-3 text-black border-l-4 border-[var(--color-accent)] pl-3 font-semibold">
        Redeem Your Points
      </h2>
      <Tabs tabs={tabs} defaultTab="all" />
    </div>
  );
};

interface RewardsGridContentProps {
  rewards: Reward[];
  userPoints: number;
  onRedeem: (rewardId: string) => void;
  loading: boolean;
  redeeming: boolean;
}

const RewardsGridContent: React.FC<RewardsGridContentProps> = ({
  rewards,
  userPoints,
  onRedeem,
  loading,
  redeeming,
}) => {
  if (loading) {
    return (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse" />
        ))}
      </div>
    );
  }

  if (rewards.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No rewards found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6">
      {rewards.map((reward) => (
        <RewardCard
          key={reward.id}
          reward={reward}
          userPoints={userPoints}
          onRedeem={onRedeem}
          disabled={redeeming}
        />
      ))}
    </div>
  );
};
