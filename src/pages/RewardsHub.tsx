import React, { useState, useEffect } from 'react';
import { Bell, Menu } from 'lucide-react';
import { Tabs, ConfettiModal } from '../components/ui';
import {
  Sidebar,
  PointsBalance,
  DailyStreak,
  TopToolSpotlight,
  EarnMorePoints,
  ReferralSection,
  RewardsGrid,
} from '../components/rewards';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services';

export const RewardsHub: React.FC = () => {
  const { user, userProfile, refreshUserProfile } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [canCheckIn, setCanCheckIn] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    pointsEarned: 0,
  });

  useEffect(() => {
    if (user) {
      checkCanCheckIn();
      loadReferralStats();
    }
  }, [user]);

  const checkCanCheckIn = async () => {
    if (!user) return;
    try {
      const can = await userService.canCheckInToday(user.id);
      setCanCheckIn(can);
    } catch (error) {
      console.error('Error checking check-in status:', error);
    }
  };

  const loadReferralStats = async () => {
    if (!user) return;
    try {
      const stats = await userService.getReferralStats(user.id);
      setReferralStats(stats);
    } catch (error) {
      console.error('Error loading referral stats:', error);
    }
  };

  const handleCheckIn = async () => {
    if (!user || !canCheckIn) return;

    setCheckingIn(true);
    try {
      const pointsEarned = await userService.dailyCheckIn(user.id);
      if (pointsEarned > 0) {
        setEarnedPoints(pointsEarned);
        setShowConfetti(true);
        await refreshUserProfile();
        setCanCheckIn(false);
      } else {
        alert('You already checked in today!');
      }
    } catch (error) {
      console.error('Error checking in:', error);
      alert('Failed to check in. Please try again.');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleTaskClaimed = async () => {
    alert('✅ Task submitted successfully! Points will be awarded after verification.');
    await refreshUserProfile();
  };

  const handleRewardRedeemed = async () => {
    await refreshUserProfile();
  };

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to access Rewards Hub</h1>
          <p className="text-gray-600">You need to be authenticated to view this page.</p>
        </div>
      </div>
    );
  }

  const earnPointsTab = (
    <div>
      <div>
        <h2 className="text-lg md:text-2xl my-3 text-black border-l-4 border-[var(--color-accent)] pl-3 font-semibold">
          Your Rewards Journey
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PointsBalance
            points={userProfile.points_balance}
            nextRewardThreshold={5000}
            nextRewardName="$5 Gift Card"
          />
          <DailyStreak
            streak={userProfile.daily_streak}
            canCheckIn={canCheckIn}
            onCheckIn={handleCheckIn}
            loading={checkingIn}
          />
          <TopToolSpotlight onTaskClaimed={handleTaskClaimed} />
        </div>
      </div>

      <EarnMorePoints />

      <ReferralSection
        referralCode={userProfile.referral_code || ''}
        referralStats={referralStats}
      />
    </div>
  );

  const redeemRewardsTab = (
    <RewardsGrid userPoints={userProfile.points_balance} onRewardRedeemed={handleRewardRedeemed} />
  );

  const tabs = [
    {
      id: 'earn',
      label: 'Earn Points',
      content: earnPointsTab,
    },
    {
      id: 'redeem',
      label: 'Redeem Rewards',
      content: redeemRewardsTab,
    },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      {/* Confetti Modal */}
      <ConfettiModal
        isOpen={showConfetti}
        onClose={() => setShowConfetti(false)}
        points={earnedPoints}
      />

      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
        currentUser={{ email: user.email || "" }}
      />

      {/* Main Content */}
      <main className="w-full bg-gray-50 px-4 lg:px-8 lg:pt-8 min-h-screen flex-grow md:overflow-y-auto box-border main-content-with-sidebar">
        <div className="relative bg-gray-50">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gray-50 pb-2 flex py-2 pt-3 lg:pt-0 lg:py-0">
            <div className="bg-gray-50 flex justify-between items-center w-full">
              <div className="flex items-center gap-3">
                <button
                  className="lg:hidden"
                  onClick={() => setIsMobileSidebarOpen(true)}
                >
                  <Menu className="w-7 h-7" />
                </button>
                <h1 className="text-xl md:text-2xl font-medium">Rewards Hub</h1>
              </div>
              <div className="mt-2">
                <button
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-6 h-6 text-gray-700" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-gray-600 mb-4">
            Earn points, unlock rewards, and celebrate your progress!
          </p>

          {/* Tabs */}
          <div className="pb-8">
            <Tabs tabs={tabs} defaultTab="earn" />
          </div>
        </div>
      </main>
    </div>
  );
};
