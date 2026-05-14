export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          display_name: string | null
          email: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          display_name?: string | null
          email?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          display_name?: string | null
          email?: string | null
          created_at?: string
        }
      }
      prayer_requests: {
        Row: {
          id: string
          user_id: string
          request_body: string
          scripture_ref: string
          verse_content: string | null
          parallax_config: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          request_body: string
          scripture_ref: string
          verse_content?: string | null
          parallax_config?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          request_body?: string
          scripture_ref?: string
          verse_content?: string | null
          parallax_config?: Json
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
  }
}
