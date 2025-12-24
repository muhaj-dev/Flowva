import React, { useState } from 'react';
import { Users, Copy, Check } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../ui';
import { FaFacebookF, FaXTwitter, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6';

interface ReferralSectionProps {
  referralCode: string;
  referralStats: {
    totalReferrals: number;
    pointsEarned: number;
  };
  siteUrl?: string;
}

export const ReferralSection: React.FC<ReferralSectionProps> = ({
  referralCode,
  referralStats,
  siteUrl = 'https://app.flowvahub.com',
}) => {
  const [copied, setCopied] = useState(false);
  const referralLink = `${siteUrl}/signup/?ref=${referralCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareToSocial = (platform: string) => {
    const text = `Join me on FlowvaHub and earn rewards! Use my referral link:`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(referralLink);

    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    };

    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg md:text-2xl my-3 text-black border-l-4 border-[var(--color-accent)] pl-3 font-semibold">
        Refer & Earn
      </h2>

      <Card className="" noPadding>
        <CardHeader colored>
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-[var(--color-primary)]" />
            <div>
              <h3 className="text-xl font-semibold text-gray-700">Share Your Link</h3>
              <p className="text-gray-500 text-sm">
                Invite friends and earn 25 points when they join!
              </p>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-6">
            {/* Stats */}
            <div className="flex justify-between mb-4">
              <div className="text-center p-2 flex-1">
                <div className="text-2xl font-semibold text-[var(--color-primary)]">
                  {referralStats.totalReferrals}
                </div>
                <div className="text-gray-600 text-sm">Referrals</div>
              </div>
              <div className="text-center p-2 flex-1">
                <div className="text-2xl font-semibold text-[var(--color-primary)]">
                  {referralStats.pointsEarned}
                </div>
                <div className="text-gray-600 text-sm">Points Earned</div>
              </div>
            </div>

            {/* Referral Link */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm mb-2 text-gray-700 font-medium">Your personal referral link:</p>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                />
                <button
                  onClick={handleCopy}
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer z-10 hover:opacity-70 transition-opacity"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-[var(--color-primary)]" />
                  )}
                </button>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => shareToSocial('facebook')}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform duration-200 hover:-translate-y-1 bg-[#1877F2]"
                title="Share on Facebook"
              >
                <FaFacebookF className="w-4 h-4" />
              </button>
              <button
                onClick={() => shareToSocial('twitter')}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform duration-200 hover:-translate-y-1 bg-black"
                title="Share on Twitter/X"
              >
                <FaXTwitter className="w-4 h-4" />
              </button>
              <button
                onClick={() => shareToSocial('linkedin')}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform duration-200 hover:-translate-y-1 bg-[#0077B5]"
                title="Share on LinkedIn"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => shareToSocial('whatsapp')}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform duration-200 hover:-translate-y-1 bg-[#25D366]"
                title="Share on WhatsApp"
              >
                <FaWhatsapp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
