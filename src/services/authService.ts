import { supabase } from '../lib/supabase';

export const authService = {
  // Sign up a new user
  async signUp(email: string, password: string, referralCode?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // Create user profile
    if (data.user) {
      const { error: profileError } = await supabase.from('users').insert({
        id: data.user.id,
        email: data.user.email!,
        points_balance: 10, // Starting bonus
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

      // Log signup bonus activity
      await supabase.from('user_activities').insert({
        user_id: data.user.id,
        activity_type: 'signup_bonus',
        points_earned: 10,
        description: 'Welcome bonus',
      });
    }

    return data;
  },

  // Sign in
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current session
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  // Get current user
  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },
};
