import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Types for our database schema
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          plan: 'free' | 'starter' | 'pro' | 'business'
          plan_expires_at: string | null
          subscription_id: string | null
          stripe_customer_id: string | null
          onboarding_completed: boolean
          ai_generations_used: number
          ai_generations_limit: number
          social_accounts: Record<string, any>
          preferences: Record<string, any>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          avatar_url?: string | null
          plan?: 'free' | 'starter' | 'pro' | 'business'
          plan_expires_at?: string | null
          subscription_id?: string | null
          stripe_customer_id?: string | null
          onboarding_completed?: boolean
          ai_generations_used?: number
          ai_generations_limit?: number
          social_accounts?: Record<string, any>
          preferences?: Record<string, any>
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          plan?: 'free' | 'starter' | 'pro' | 'business'
          plan_expires_at?: string | null
          subscription_id?: string | null
          stripe_customer_id?: string | null
          onboarding_completed?: boolean
          ai_generations_used?: number
          ai_generations_limit?: number
          social_accounts?: Record<string, any>
          preferences?: Record<string, any>
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          platform: string
          content_type: string
          title: string | null
          caption: string | null
          description: string | null
          hashtags: string[] | null
          scheduled_time: string | null
          published_time: string | null
          status: 'draft' | 'scheduled' | 'published' | 'failed' | 'cancelled'
          platform_post_id: string | null
          ai_generated: boolean
          ai_prompt: string | null
          engagement_data: Record<string, any>
          error_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: string
          content_type: string
          title?: string | null
          caption?: string | null
          description?: string | null
          hashtags?: string[] | null
          scheduled_time?: string | null
          published_time?: string | null
          status?: 'draft' | 'scheduled' | 'published' | 'failed' | 'cancelled'
          platform_post_id?: string | null
          ai_generated?: boolean
          ai_prompt?: string | null
          engagement_data?: Record<string, any>
          error_message?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          platform?: string
          content_type?: string
          title?: string | null
          caption?: string | null
          description?: string | null
          hashtags?: string[] | null
          scheduled_time?: string | null
          published_time?: string | null
          status?: 'draft' | 'scheduled' | 'published' | 'failed' | 'cancelled'
          platform_post_id?: string | null
          ai_generated?: boolean
          ai_prompt?: string | null
          engagement_data?: Record<string, any>
          error_message?: string | null
        }
      }
      social_accounts: {
        Row: {
          id: string
          user_id: string
          platform: string
          platform_user_id: string
          username: string | null
          display_name: string | null
          avatar_url: string | null
          access_token: string | null
          refresh_token: string | null
          token_expires_at: string | null
          account_data: Record<string, any>
          is_active: boolean
          connected_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: string
          platform_user_id: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          access_token?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          account_data?: Record<string, any>
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          platform?: string
          platform_user_id?: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          access_token?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          account_data?: Record<string, any>
          is_active?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const createSupabaseClient = () => createClientComponentClient<Database>()

// Server-side Supabase client
export const createSupabaseServerClient = () => createServerComponentClient<Database>({ cookies })

// Admin client for server-side operations
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Basic client for public operations
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper functions
export const getCurrentUser = async () => {
  const supabase = createSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }

  // Get user profile from our users table
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return { ...user, profile }
}

export const getCurrentUserServer = async () => {
  const supabase = createSupabaseServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }

  // Get user profile from our users table
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return { ...user, profile }
}

export const signInWithGoogle = async () => {
  const supabase = createSupabaseClient()
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
  return { error }
}

export const signOut = async () => {
  const supabase = createSupabaseClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const checkUserPlan = async (userId: string) => {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('users')
    .select('plan, plan_expires_at, ai_generations_used, ai_generations_limit')
    .eq('id', userId)
    .single()

  if (error) {
    return { plan: 'free', hasAccess: false }
  }

  const hasAccess = data.plan !== 'free' && 
    (!data.plan_expires_at || new Date(data.plan_expires_at) > new Date())

  return {
    plan: data.plan,
    hasAccess,
    aiGenerationsUsed: data.ai_generations_used,
    aiGenerationsLimit: data.ai_generations_limit
  }
}