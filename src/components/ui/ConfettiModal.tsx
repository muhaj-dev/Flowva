import React, { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';
import Confetti from 'react-confetti';

interface ConfettiModalProps {
  isOpen: boolean;
  onClose: () => void;
  points: number;
  message?: string;
  title?: string;
}

export const ConfettiModal: React.FC<ConfettiModalProps> = ({
  isOpen,
  onClose,
  points,
  message = "You've claimed your daily points! Come back tomorrow for more!",
  title = 'Level Up!',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [modalSize, setModalSize] = useState({
    width: 0,
    height: 0,
  });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const updateModalSize = () => {
      if (modalRef.current) {
        setModalSize({
          width: modalRef.current.offsetWidth,
          height: modalRef.current.offsetHeight,
        });
      }
    };

    if (isOpen) {
      // Update size after modal is rendered
      setTimeout(updateModalSize, 100);
      window.addEventListener('resize', updateModalSize);
      return () => window.removeEventListener('resize', updateModalSize);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      // Stop confetti after 5 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-scaleIn overflow-hidden"
      >
        {/* Confetti */}
        {showConfetti && modalSize.width > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            <Confetti
              width={modalSize.width}
              height={modalSize.height}
              numberOfPieces={200}
              recycle={false}
              colors={['#9013FE', '#70D6FF', '#FF70A6', '#FFD670', '#70FFB8', '#FF9770']}
              gravity={0.3}
            />
          </div>
        )}
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center animate-bounceIn">
                <svg
                  className="w-12 h-12 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#9013FE] to-[#70D6FF] bg-clip-text text-transparent">
            {title} 🎉
          </h2>

          {/* Points */}
          <div className="mb-4">
            <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              +{points}
            </span>
            <span className="text-2xl font-semibold text-purple-600 ml-2">Points</span>
          </div>

          {/* Decorative icons */}
          <div className="flex justify-center gap-3 mb-6 text-2xl">
            <span className="animate-bounce" style={{ animationDelay: '0s' }}>🎊</span>
            <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>💎</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🎯</span>
          </div>

          {/* Message */}
          <p className="text-gray-600 text-base mb-8 leading-relaxed">
            {message}
          </p>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full py-3 px-6 bg-gradient-to-r from-[#9013FE] to-[#70D6FF] text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
};
