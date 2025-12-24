export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          points_balance: number
          daily_streak: number
          last_check_in: string | null
          referral_code: string | null
          referred_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          points_balance?: number
          daily_streak?: number
          last_check_in?: string | null
          referral_code?: string | null
          referred_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          points_balance?: number
          daily_streak?: number
          last_check_in?: string | null
          referral_code?: string | null
          referred_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      rewards: {
        Row: {
          id: string
          name: string
          description: string | null
          point_cost: number
          category: 'gift_card' | 'cash' | 'course' | 'other' | null
          status: 'locked' | 'unlocked' | 'coming_soon'
          image_url: string | null
          emoji: string | null
          redemption_type: string | null
          created_at: string
          order_index: number
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          point_cost: number
          category?: 'gift_card' | 'cash' | 'course' | 'other' | null
          status?: 'locked' | 'unlocked' | 'coming_soon'
          image_url?: string | null
          emoji?: string | null
          redemption_type?: string | null
          created_at?: string
          order_index?: number
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          point_cost?: number
          category?: 'gift_card' | 'cash' | 'course' | 'other' | null
          status?: 'locked' | 'unlocked' | 'coming_soon'
          image_url?: string | null
          emoji?: string | null
          redemption_type?: string | null
          created_at?: string
          order_index?: number
        }
      }
      user_rewards: {
        Row: {
          id: string
          user_id: string
          reward_id: string
          redeemed_at: string
          status: 'pending' | 'processing' | 'completed' | 'failed'
          points_spent: number
        }
        Insert: {
          id?: string
          user_id: string
          reward_id: string
          redeemed_at?: string
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          points_spent: number
        }
        Update: {
          id?: string
          user_id?: string
          reward_id?: string
          redeemed_at?: string
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          points_spent?: number
        }
      }
      user_activities: {
        Row: {
          id: string
          user_id: string
          activity_type: 'daily_checkin' | 'task_completion' | 'reward_redemption' | 'referral' | 'signup_bonus'
          points_earned: number
          points_spent: number
          description: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_type: 'daily_checkin' | 'task_completion' | 'reward_redemption' | 'referral' | 'signup_bonus'
          points_earned?: number
          points_spent?: number
          description?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_type?: 'daily_checkin' | 'task_completion' | 'reward_redemption' | 'referral' | 'signup_bonus'
          points_earned?: number
          points_spent?: number
          description?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          name: string
          description: string | null
          points_reward: number
          requirements: Json | null
          status: 'active' | 'inactive' | 'coming_soon'
          button_text: string | null
          external_link: string | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          points_reward: number
          requirements?: Json | null
          status?: 'active' | 'inactive' | 'coming_soon'
          button_text?: string | null
          external_link?: string | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          points_reward?: number
          requirements?: Json | null
          status?: 'active' | 'inactive' | 'coming_soon'
          button_text?: string | null
          external_link?: string | null
          image_url?: string | null
          created_at?: string
        }
      }
      user_tasks: {
        Row: {
          id: string
          user_id: string
          task_id: string
          submission_data: Json | null
          status: 'pending' | 'submitted' | 'verified' | 'rejected'
          verified_at: string | null
          points_awarded: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id: string
          submission_data?: Json | null
          status?: 'pending' | 'submitted' | 'verified' | 'rejected'
          verified_at?: string | null
          points_awarded?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string
          submission_data?: Json | null
          status?: 'pending' | 'submitted' | 'verified' | 'rejected'
          verified_at?: string | null
          points_awarded?: boolean
          created_at?: string
        }
      }
      referrals: {
        Row: {
          id: string
          referrer_id: string
          referee_id: string
          status: 'pending' | 'completed' | 'failed'
          points_awarded: boolean
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          referrer_id: string
          referee_id: string
          status?: 'pending' | 'completed' | 'failed'
          points_awarded?: boolean
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          referrer_id?: string
          referee_id?: string
          status?: 'pending' | 'completed' | 'failed'
          points_awarded?: boolean
          created_at?: string
          completed_at?: string | null
        }
      }
    }
    Functions: {
      handle_daily_checkin: {
        Args: { user_id: string }
        Returns: number
      }
      redeem_reward: {
        Args: { user_id: string; reward_id: string }
        Returns: Json
      }
      award_task_points: {
        Args: { user_id: string; task_id: string }
        Returns: Json
      }
      complete_referral: {
        Args: { referee_id: string }
        Returns: Json
      }
      generate_referral_code: {
        Args: Record<string, never>
        Returns: string
      }
    }
  }
}
