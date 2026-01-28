import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for the database
export type Database = {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string
          user_id: string
          business_name: string
          industry_type: 'clinic' | 'coaching' | 'real_estate' | 'local_service'
          services: string[] | null
          city: string | null
          whatsapp_number: string
          business_description: string | null
          operating_hours: Record<string, any> | null
          location: string | null
          contact_preferences: string[] | null
          widget_settings: Record<string, any> | null
          slug: string
          has_website: boolean
          plan_status: 'trial' | 'active' | 'expired'
          trial_ends_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          industry_type: 'clinic' | 'coaching' | 'real_estate' | 'local_service'
          services?: string[] | null
          city?: string | null
          whatsapp_number: string
          business_description?: string | null
          operating_hours?: Record<string, any> | null
          location?: string | null
          contact_preferences?: string[] | null
          widget_settings?: Record<string, any> | null
          slug: string
          has_website?: boolean
          plan_status?: 'trial' | 'active' | 'expired'
          trial_ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          industry_type?: 'clinic' | 'coaching' | 'real_estate' | 'local_service'
          services?: string[] | null
          city?: string | null
          whatsapp_number?: string
          business_description?: string | null
          operating_hours?: Record<string, any> | null
          location?: string | null
          contact_preferences?: string[] | null
          widget_settings?: Record<string, any> | null
          slug?: string
          has_website?: boolean
          plan_status?: 'trial' | 'active' | 'expired'
          trial_ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          business_id: string
          visitor_id: string
          status: 'active' | 'human_takeover' | 'closed'
          human_operator: string | null
          lead_qualified: boolean
          metadata: Record<string, any> | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          visitor_id: string
          status?: 'active' | 'human_takeover' | 'closed'
          human_operator?: string | null
          lead_qualified?: boolean
          metadata?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          visitor_id?: string
          status?: 'active' | 'human_takeover' | 'closed'
          human_operator?: string | null
          lead_qualified?: boolean
          metadata?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_type: 'visitor' | 'ai' | 'human' | 'system'
          sender_id: string | null
          message_text: string
          message_type: 'text' | 'image' | 'file'
          metadata: Record<string, any> | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_type: 'visitor' | 'ai' | 'human' | 'system'
          sender_id?: string | null
          message_text: string
          message_type?: 'text' | 'image' | 'file'
          metadata?: Record<string, any> | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_type?: 'visitor' | 'ai' | 'human' | 'system'
          sender_id?: string | null
          message_text?: string
          message_type?: 'text' | 'image' | 'file'
          metadata?: Record<string, any> | null
          created_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          business_id: string
          conversation_id: string
          name: string
          phone_number: string
          email: string | null
          lead_source: string
          qualification_data: Record<string, any> | null
          status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
          whatsapp_sent: boolean
          whatsapp_sent_at: string | null
          owner_response: 'YES' | 'NO' | null
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          conversation_id: string
          name: string
          phone_number: string
          email?: string | null
          lead_source?: string
          qualification_data?: Record<string, any> | null
          status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
          whatsapp_sent?: boolean
          whatsapp_sent_at?: string | null
          owner_response?: 'YES' | 'NO' | null
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          conversation_id?: string
          name?: string
          phone_number?: string
          email?: string | null
          lead_source?: string
          qualification_data?: Record<string, any> | null
          status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
          whatsapp_sent?: boolean
          whatsapp_sent_at?: string | null
          owner_response?: 'YES' | 'NO' | null
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          business_id: string
          razorpay_subscription_id: string | null
          plan_name: string | null
          amount: number | null
          status: 'active' | 'past_due' | 'cancelled'
          current_period_start: string | null
          current_period_end: string | null
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          razorpay_subscription_id?: string | null
          plan_name?: string | null
          amount?: number | null
          status?: 'active' | 'past_due' | 'cancelled'
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          razorpay_subscription_id?: string | null
          plan_name?: string | null
          amount?: number | null
          status?: 'active' | 'past_due' | 'cancelled'
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
        }
      }
      usage_tracking: {
        Row: {
          id: string
          business_id: string
          date: string
          message_count: number
          lead_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          date?: string
          message_count?: number
          lead_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          date?: string
          message_count?: number
          lead_count?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}