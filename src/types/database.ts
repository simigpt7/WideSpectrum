export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          name: string;
          role: string;
          is_active: boolean;
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password_hash: string;
          name: string;
          role?: string;
          is_active?: boolean;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password_hash?: string;
          name?: string;
          role?: string;
          is_active?: boolean;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          title: string;
          description: string;
          icon_name: string;
          features: Json;
          is_featured: boolean;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          icon_name?: string;
          features?: Json;
          is_featured?: boolean;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          icon_name?: string;
          features?: Json;
          is_featured?: boolean;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
      };
      portfolio_items: {
        Row: {
          id: string;
          youtube_id: string;
          title: string;
          artist: string;
          description: string | null;
          category: string;
          display_order: number;
          is_featured: boolean;
          is_active: boolean;
          view_count: number;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          youtube_id: string;
          title: string;
          artist: string;
          description?: string | null;
          category?: string;
          display_order?: number;
          is_featured?: boolean;
          is_active?: boolean;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          youtube_id?: string;
          title?: string;
          artist?: string;
          description?: string | null;
          category?: string;
          display_order?: number;
          is_featured?: boolean;
          is_active?: boolean;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
      };
      testimonials: {
        Row: {
          id: string;
          text: string;
          client_name: string;
          client_role: string;
          client_company: string | null;
          rating: number;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          text: string;
          client_name: string;
          client_role: string;
          client_company?: string | null;
          rating?: number;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          text?: string;
          client_name?: string;
          client_role?: string;
          client_company?: string | null;
          rating?: number;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          service: string | null;
          message: string;
          status: string;
          notes: string | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
          updated_at: string;
          replied_at: string | null;
          replied_by: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          service?: string | null;
          message: string;
          status?: string;
          notes?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
          updated_at?: string;
          replied_at?: string | null;
          replied_by?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          service?: string | null;
          message?: string;
          status?: string;
          notes?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
          updated_at?: string;
          replied_at?: string | null;
          replied_by?: string | null;
        };
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          description: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          description?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          description?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
      };
      collaborators: {
        Row: {
          id: string;
          name: string;
          profession: string | null;
          image_url: string | null;
          bio: string | null;
          website_url: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          profession?: string | null;
          image_url?: string | null;
          bio?: string | null;
          website_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          profession?: string | null;
          image_url?: string | null;
          bio?: string | null;
          website_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
