import { createClient } from '@supabase/supabase-js';

// Replace these with your own Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase credentials are provided
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

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
