import React, { useState } from 'react';
import { UserPlus, Gift, Calendar } from 'lucide-react';
import { Button } from '../ui';
import { ClaimPointsModal } from './ClaimPointsModal';

interface TopToolSpotlightProps {
  onTaskClaimed?: () => void;
}

export const TopToolSpotlight: React.FC<TopToolSpotlightProps> = ({ onTaskClaimed }) => {
  const [showClaimModal, setShowClaimModal] = useState(false);

  const handleSignUp = () => {
    window.open('https://reclaim.ai', '_blank');
  };

  const handleClaimPoints = () => {
    setShowClaimModal(true);
  };

  return (
    <>
      <div className="bg-white rounded-2xl card-shadow hover:-translate-y-1 hover:card-shadow-hover border border-[var(--color-border)] overflow-hidden transition-all duration-300 flex flex-col h-full">
        {/* Header with Gradient */}
        <div className="p-4 bg-[linear-gradient(135deg,_#9013FE_0%,_#70D6FF_100%)] text-white relative overflow-hidden">
          
          <div className="flex items-center justify-between">
            <div>
              <div className="w-fit bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
              <h3 className="text-[1.25rem] font-bold relative z-[2]">Top Tool Spotlight</h3>
              <p className="text-lg mt-0">
                <strong>Reclaim</strong>
              </p>
            </div>
            <div className="overflow-hidden relative rounded-full size-10 md:size-16">
               <img
              src="https://api.flowvahub.com/storage/v1/object/public/icons//reclaim%20(1).png"
              alt="Flowva Logo"
              className="w-[145px] h-[60px] object-contain"
            />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 flex-1">
          <div className="flex justify-start gap-4">
            <div className="w-10 h-10 bg-[var(--color-primary-light)] rounded-lg flex items-center justify-center flex-shrink-0 text-[var(--color-primary)]">
              <Calendar className="w-5 h-5" />
              
            </div>
            <div className="flex-1">
              <h4 className="mb-2 font-semibold text-base">Automate and Optimize Your Schedule</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Reclaim.ai is an AI-powered calendar assistant that automatically schedules your
                tasks, meetings, and breaks to boost productivity. Free to try — earn Flowva Points
                when you sign up!
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 flex justify-start items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            icon={UserPlus}
            onClick={handleSignUp}
          >
            Sign up
          </Button>
          <Button
            variant="gradient"
            size="sm"
            icon={Gift}
            onClick={handleClaimPoints}
          >
            Claim 50 pts
          </Button>
        </div>
      </div>

      {/* Claim Points Modal */}
      <ClaimPointsModal
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        onSuccess={() => {
          setShowClaimModal(false);
          onTaskClaimed?.();
        }}
      />
    </>
  );
};
