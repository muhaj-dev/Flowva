import React, { useState } from 'react';
import { Star, Share2 } from 'lucide-react';
import { Button } from '../ui';
import { ShareStackModal } from './ShareStackModal';

export const EarnMorePoints: React.FC = () => {
  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <>
      <div className="space-y-6">
        <h2 className="text-lg md:text-2xl my-3 text-black border-l-4 border-[var(--color-accent)] pl-3 font-semibold">
          Earn More Points
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Referral Card */}
          <div className="border border-gray-200 rounded-xl overflow-hidden transition-all hover:border-[var(--color-primary)] hover:-translate-y-1 hover:card-shadow-hover duration-200">
            <div className=" bg-white p-6 border-b border-gray-100 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-[rgba(228,144,230,0.1)] text-[var(--color-primary)]">
                <Star className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[14px] mb-1">Refer and win 10,000 points!</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700 leading-relaxed">
                Invite 3 friends by Nov 20 and earn a chance to be one of 5 winners of{' '}
                <span className="text-[var(--color-primary)] font-semibold">10,000 points</span>. Friends must
                complete onboarding to qualify.
              </p>
            </div>
          </div>

          {/* Share Stack Card */}
          <div className="border border-gray-200 rounded-xl overflow-hidden transition-all hover:border-[var(--color-primary)] hover:-translate-y-1 hover:card-shadow-hover duration-200">
            <div className="bg-white p-6 border-b border-gray-100 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-[rgba(144,19,254,0.1)] text-[var(--color-primary)]">
                <Share2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Share Your Stack</h3>
                <p className="text-sm text-gray-500">Earn +25 pts</p>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">Share your tool stack</p>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Share2}
                  onClick={() => setShowShareModal(true)}
                >
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ShareStackModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} />
    </>
  );
};
