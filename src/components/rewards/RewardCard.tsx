import React from 'react';
import { Lock } from 'lucide-react';
import { Button } from '../ui';
import type { Reward } from '../../types';

interface RewardCardProps {
  reward: Reward;
  userPoints: number;
  onRedeem: (rewardId: string) => void;
  disabled?: boolean;
}

export const RewardCard: React.FC<RewardCardProps> = ({
  reward,
  userPoints,
  onRedeem,
  disabled = false,
}) => {
  const isUnlocked = userPoints >= reward.point_cost && reward.status !== 'coming_soon';
  const isComingSoon = reward.status === 'coming_soon';
  const isLocked = !isUnlocked && !isComingSoon;

  const getButtonText = () => {
    if (isComingSoon) return 'Coming Soon';
    if (isLocked) return 'Locked';
    return 'Redeem';
  };

  const getButtonVariant = () => {
    if (isComingSoon || isLocked) return 'disabled';
    return 'primary';
  };

  return (
    <div
      className={`border border-[var(--color-primary-border)] bg-white rounded-xl p-6 card-shadow relative overflow-hidden transition-all duration-200 ${
        isLocked || isComingSoon
          ? 'opacity-70 cursor-not-allowed'
          : 'hover:-translate-y-1 hover:card-shadow-hover'
      }`}
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl bg-[var(--color-primary-border)] text-[var(--color-primary)]">
        {reward.emoji || '🎁'}
      </div>

      {/* Title */}
      <h4 className="text-center text-lg font-semibold mb-2">{reward.name}</h4>

      {/* Description */}
      <p className="text-center text-sm text-gray-700 mb-4 min-h-[3rem]">
        {reward.description || 'No description available'}
      </p>

      {/* Points */}
      <div className="flex items-center justify-center text-[var(--color-primary)] font-semibold mb-4">
        ⭐ {reward.point_cost} pts
      </div>

      {/* Redeem Button */}
      <Button
        variant={getButtonVariant()}
        size="md"
        className="w-full"
        onClick={() => onRedeem(reward.id)}
        disabled={!isUnlocked || disabled}
        icon={isLocked ? Lock : undefined}
      >
        {getButtonText()}
      </Button>
    </div>
  );
};
