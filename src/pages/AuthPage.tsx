import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button, Input, Card } from '../components/ui';

export const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;

        if (authData.user) {
          // Check if email confirmation is required
          if (authData.session) {
            // Email confirmation is disabled - user is logged in
            // Create user profile
            const { error: profileError } = await supabase
              .from('users')
              .insert({
                id: authData.user.id,
                email: authData.user.email!,
                referred_by: referralCode ? await getReferrerIdByCode(referralCode) : null,
              });

            if (profileError) throw profileError;

            // If referred, create referral record
            if (referralCode) {
              const referrerId = await getReferrerIdByCode(referralCode);
              if (referrerId) {
                await supabase.from('referrals').insert({
                  referrer_id: referrerId,
                  referee_id: authData.user.id,
                });
              }
            }

            // Log signup bonus
            await supabase.from('user_activities').insert({
              user_id: authData.user.id,
              activity_type: 'signup_bonus',
              points_earned: 10,
              description: 'Welcome bonus for signing up!',
            });

            setMessage('Account created successfully! Loading your rewards...');
            // AuthContext will automatically detect the user and redirect
          } else {
            // Email confirmation is enabled
            setMessage('Please check your email to confirm your account before signing in.');
          }
        }
      } else {
        // Sign in
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        setMessage('Signed in successfully! Loading...');
        // AuthContext will automatically detect the user and redirect
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getReferrerIdByCode = async (code: string): Promise<string | null> => {
    const { data } = await supabase
      .from('users')
      .select('id')
      .eq('referral_code', code)
      .single();
    return data?.id || null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to FlowvaHub
            </h1>
            <p className="text-gray-600">
              {isSignUp ? 'Create your account to start earning rewards' : 'Sign in to access your rewards'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Referral Code (Optional)
                </label>
                <Input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="Enter referral code"
                />
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                {message}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          {/* Toggle Sign In / Sign Up */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setMessage('');
              }}
              className="text-primary hover:text-primary-hover font-medium text-sm"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>

          {/* Bonus Info for Sign Up */}
          {isSignUp && (
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-700 text-center">
                <span className="font-semibold text-primary">🎁 Welcome Bonus:</span> Get 10 points just for signing up!
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
