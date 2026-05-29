import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Some features may not work.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Types for database tables
export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  created_at?: string;
  status?: 'new' | 'read' | 'replied';
}

// Table name constant
export const TABLES = {
  CONTACT_SUBMISSIONS: 'contact_submissions',
} as const;
