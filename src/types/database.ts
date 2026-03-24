export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          onboarded: boolean
          plan: 'free' | 'starter' | 'pro'
          posts_this_month: number
          comments_this_month: number
          rewrites_this_month: number
          usage_reset_at: string
          last_posted_at: string | null
          email_notifications: boolean
          acquisition_source: string | null
          streak_days: number
          paddle_customer_id: string | null
          paddle_subscription_id: string | null
          subscription_status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          onboarded?: boolean
          plan?: 'free' | 'starter' | 'pro'
          posts_this_month?: number
          comments_this_month?: number
          rewrites_this_month?: number
          usage_reset_at?: string
          last_posted_at?: string | null
          email_notifications?: boolean
          acquisition_source?: string | null
          streak_days?: number
          paddle_customer_id?: string | null
          paddle_subscription_id?: string | null
          subscription_status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
        Relationships: []
      }
      companies: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string
          target_audience: string
          industry: string[]
          stage: 'idea' | 'mvp' | 'live' | 'scale'
          founder_goal: 'get_users' | 'build_audience' | 'raise_funds' | 'hire'
          tone: 'professional' | 'casual' | 'bold' | 'educational'
          founder_personality: 'builder' | 'storyteller' | 'analyst' | 'contrarian'
          persona_statement: string | null
          content_pillars: string[] | null
          keywords: string[] | null
          website_url: string | null
          linkedin_url: string | null
          is_individual: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description: string
          target_audience: string
          industry: string[]
          stage: 'idea' | 'mvp' | 'live' | 'scale'
          founder_goal: 'get_users' | 'build_audience' | 'raise_funds' | 'hire'
          tone: 'professional' | 'casual' | 'bold' | 'educational'
          founder_personality: 'builder' | 'storyteller' | 'analyst' | 'contrarian'
          persona_statement?: string | null
          content_pillars?: string[] | null
          keywords?: string[] | null
          website_url?: string | null
          linkedin_url?: string | null
          is_individual?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['companies']['Insert']>
        Relationships: []
      }
      generated_posts: {
        Row: {
          id: string
          user_id: string
          company_id: string
          topic: string
          variation_safe: string
          variation_bold: string
          variation_controversial: string
          selected_variation: 'safe' | 'bold' | 'controversial' | null
          post_structure: string | null
          hook_type: string | null
          tone_used: string
          is_saved: boolean
          is_published: boolean
          published_at: string | null
          linkedin_url: string | null
          was_copied: boolean
          performance_rating: 1 | 2 | 3 | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_id: string
          topic: string
          variation_safe: string
          variation_bold: string
          variation_controversial: string
          selected_variation?: 'safe' | 'bold' | 'controversial' | null
          post_structure?: string | null
          hook_type?: string | null
          tone_used: string
          is_saved?: boolean
          is_published?: boolean
          published_at?: string | null
          linkedin_url?: string | null
          was_copied?: boolean
          performance_rating?: 1 | 2 | 3 | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['generated_posts']['Insert']>
        Relationships: []
      }
      comment_suggestions: {
        Row: {
          id: string
          user_id: string
          company_id: string
          source_post: string
          source_url: string | null
          comment_insightful: string
          comment_curious: string
          comment_bold: string
          is_saved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_id: string
          source_post: string
          source_url?: string | null
          comment_insightful: string
          comment_curious: string
          comment_bold: string
          is_saved?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['comment_suggestions']['Insert']>
        Relationships: []
      }
      draft_rewrites: {
        Row: {
          id: string
          user_id: string
          company_id: string
          original_draft: string
          rewritten: string
          hooks: string[] | null
          selected_hook: string | null
          is_saved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_id: string
          original_draft: string
          rewritten: string
          hooks?: string[] | null
          selected_hook?: string | null
          is_saved?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['draft_rewrites']['Insert']>
        Relationships: []
      }
      remixed_posts: {
        Row: {
          id: string
          user_id: string
          company_id: string
          source_post: string
          structure: string
          hook_type: string
          tone: string
          why_it_works: string
          adapted_version: string
          is_saved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_id: string
          source_post: string
          structure: string
          hook_type: string
          tone: string
          why_it_works: string
          adapted_version: string
          is_saved?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['remixed_posts']['Insert']>
        Relationships: []
      }
      sent_emails: {
        Row: {
          id: string
          user_id: string
          email_type: string
          sent_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email_type: string
          sent_at?: string
        }
        Update: Partial<Database['public']['Tables']['sent_emails']['Insert']>
        Relationships: []
      }
      tool_uses: {
        Row: {
          id: string
          tool: 'headline-analyzer' | 'post-checker' | 'voice-analyzer'
          user_id: string | null
          session_id: string | null
          score: number | null
          used_example: boolean
          referrer: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tool: 'headline-analyzer' | 'post-checker' | 'voice-analyzer'
          user_id?: string | null
          session_id?: string | null
          score?: number | null
          used_example?: boolean
          referrer?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['tool_uses']['Insert']>
        Relationships: []
      }
      waitlist: {
        Row: {
          id: string
          email: string
          source: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          source?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['waitlist']['Insert']>
        Relationships: []
      }
      subscription_events: {
        Row: {
          id: number
          user_id: string
          event_type: string
          plan: string | null
          status: string | null
          paddle_subscription_id: string | null
          paddle_customer_id: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          event_type: string
          plan?: string | null
          status?: string | null
          paddle_subscription_id?: string | null
          paddle_customer_id?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['subscription_events']['Insert']>
        Relationships: []
      }
      checkout_events: {
        Row: {
          id: number
          user_id: string | null
          event: string
          price_id: string | null
          metadata: Record<string, unknown> | null
          created_at: string
        }
        Insert: {
          user_id?: string | null
          event: string
          price_id?: string | null
          metadata?: Record<string, unknown> | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['checkout_events']['Insert']>
        Relationships: []
      }
      referrals: {
        Row: {
          id: string
          referrer_id: string
          referred_email: string | null
          referred_id: string | null
          status: 'pending' | 'signed_up' | 'rewarded'
          created_at: string
        }
        Insert: {
          id?: string
          referrer_id: string
          referred_email?: string | null
          referred_id?: string | null
          status?: 'pending' | 'signed_up' | 'rewarded'
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['referrals']['Insert']>
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Company = Database['public']['Tables']['companies']['Row']
export type GeneratedPost = Database['public']['Tables']['generated_posts']['Row']
export type CommentSuggestion = Database['public']['Tables']['comment_suggestions']['Row']
export type DraftRewrite = Database['public']['Tables']['draft_rewrites']['Row']
export type RemixedPost  = Database['public']['Tables']['remixed_posts']['Row']
export type ToolUse      = Database['public']['Tables']['tool_uses']['Row']
export type WaitlistEntry      = Database['public']['Tables']['waitlist']['Row']
export type SubscriptionEvent  = Database['public']['Tables']['subscription_events']['Row']
export type Referral           = Database['public']['Tables']['referrals']['Row']
