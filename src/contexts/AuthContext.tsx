import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { User } from '../types';
import { userService } from '../services';

interface AuthContextType {
  user: SupabaseUser | null;
  userProfile: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, referralCode?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const profile = await userService.getUserProfile(userId);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
      // If profile doesn't exist, create it
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('users').insert({
            id: user.id,
            email: user.email!,
            points_balance: 10,
          });

          // Log signup bonus
          await supabase.from('user_activities').insert({
            user_id: user.id,
            activity_type: 'signup_bonus',
            points_earned: 10,
            description: 'Welcome bonus',
          });

          // Try loading again
          const newProfile = await userService.getUserProfile(userId);
          setUserProfile(newProfile);
        }
      } catch (createError) {
        console.error('Error creating user profile:', createError);
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshUserProfile = async () => {
    if (user) {
      await loadUserProfile(user.id);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, referralCode?: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    if (data.user) {
      // Create user profile
      const { error: profileError } = await supabase.from('users').insert({
        id: data.user.id,
        email: data.user.email!,
        points_balance: 10,
        referred_by: referralCode
          ? (
              await supabase
                .from('users')
                .select('id')
                .eq('referral_code', referralCode)
                .single()
            ).data?.id
          : null,
      });

      if (profileError) throw profileError;

      // Create referral record if referred
      if (referralCode) {
        const referrer = await supabase
          .from('users')
          .select('id')
          .eq('referral_code', referralCode)
          .single();

        if (referrer.data) {
          await supabase.from('referrals').insert({
            referrer_id: referrer.data.id,
            referee_id: data.user.id,
          });
        }
      }

      // Log signup bonus
      await supabase.from('user_activities').insert({
        user_id: data.user.id,
        activity_type: 'signup_bonus',
        points_earned: 10,
        description: 'Welcome bonus',
      });
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
