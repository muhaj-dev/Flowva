import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Modal, Input, FileInput, Button } from '../ui';
import { tasksService } from '../../services';

interface ClaimPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ClaimPointsModal: React.FC<ClaimPointsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !file) {
      setError('Please fill in all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Get current user
      const { data: { user } } = await import('../../lib/supabase').then(m => m.supabase.auth.getUser());

      if (!user) {
        setError('You must be logged in to claim points');
        return;
      }

      // Get the Reclaim task (first active task)
      const tasks = await tasksService.getActiveTasks();
      const reclaimTask = tasks[0]; // Assuming Reclaim is the first task

      if (!reclaimTask) {
        setError('Task not found');
        return;
      }

      // Upload screenshot
      const screenshotUrl = await tasksService.uploadScreenshot(file, user.id, reclaimTask.id);

      // Submit task
      await tasksService.submitTask(user.id, reclaimTask.id, {
        email,
        screenshot_url: screenshotUrl,
      });

      // Success!
      onSuccess?.();
      resetForm();
    } catch (err: any) {
      console.error('Error claiming points:', err);
      setError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setFile(null);
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Claim Your 25 Points" maxWidth="lg">
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <p className="font-semibold mb-2">Follow these steps:</p>
          <ol className="list-decimal list-inside space-y-1 text-gray-700">
            <li>Enter your Reclaim sign-up email.</li>
            <li>Upload a screenshot of your Reclaim profile showing your email.</li>
          </ol>
          <p className="mt-2 text-gray-600">
            After verification, you'll get 25 Flowva Points! 🎉😊
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email used on Reclaim"
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error && !email ? 'Email is required' : ''}
          />

          <FileInput
            label="Upload screenshot (mandatory)"
            accept="image/*"
            onFileSelect={setFile}
            error={error && !file ? 'Screenshot is required' : ''}
          />

          {file && (
            <div className="text-sm text-gray-600 bg-green-50 border border-green-200 rounded-lg p-3">
              ✅ File selected: <span className="font-semibold">{file.name}</span>
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={loading}
              icon={Upload}
            >
              {loading ? 'Submitting...' : 'Submit Claim'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
