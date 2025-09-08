import { createClient } from '@supabase/supabase-js';

// Browser client for Supabase using Vite env variables
// Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in `.env`
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Throwing early helps catch misconfiguration during development
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'smart-meal-auth',
  },
});

export type { Session, User } from '@supabase/supabase-js';
