import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug environment variables
console.log('Supabase URL:', supabaseUrl);
console.log('Environment:', import.meta.env.MODE);

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase credentials. Please check your environment variables:\n' +
    `VITE_SUPABASE_URL: ${supabaseUrl ? 'Set' : 'Missing'}\n` +
    `VITE_SUPABASE_ANON_KEY: ${supabaseKey ? 'Set' : 'Missing'}\n` +
    `Current Environment: ${import.meta.env.MODE}\n`
  );
}

// Create Supabase client with debug logging
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: {
      getItem: (key) => {
        const item = localStorage.getItem(key);
        console.log('Getting item from storage:', key, item);
        return item;
      },
      setItem: (key, value) => {
        console.log('Setting item in storage:', key, value);
        localStorage.setItem(key, value);
      },
      removeItem: (key) => {
        console.log('Removing item from storage:', key);
        localStorage.removeItem(key);
      }
    }
  },
  db: {
    schema: 'public'
  }
});

// Add debug logging for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session?.user?.id);
});

// Add debug logging for database operations
const originalQuery = supabase.from;
supabase.from = function(tableName) {
  console.log('Querying table:', tableName);
  return originalQuery.call(this, tableName);
};

// Database types and helper functions
export type Profile = {
  id: string;
  username: string;
  full_name?: string;
  phone_number?: string;
  email?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
};

export type TrustedContact = {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email?: string;
  created_at: string;
};

export type LocationShare = {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  is_sharing: boolean;
  timestamp: string;
};

export type RouteShare = {
  id: string;
  user_id: string;
  destination: string;
  start_time: string;
  is_active: boolean;
};

// This type represents the tables in your database
export type Database = {
  profiles: Profile;
  trusted_contacts: TrustedContact;
  location_shares: LocationShare;
  route_shares: RouteShare;
};
