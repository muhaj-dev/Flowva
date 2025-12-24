import React from 'react';
import { Layers } from 'lucide-react';
import { Modal } from '../ui';

interface ShareStackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareStackModal: React.FC<ShareStackModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center mx-auto mb-4">
          <Layers className="w-8 h-8 text-[var(--color-primary)]" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Share Your Stack</h2>
        <p className="text-gray-600">
          You have no stack created yet, go to Tech Stack to create one.
        </p>
      </div>
    </Modal>
  );
};
