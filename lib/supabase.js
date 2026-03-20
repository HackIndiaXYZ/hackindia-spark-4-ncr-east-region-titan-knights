import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL  || '';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const configured = url.startsWith('https://') && key.startsWith('eyJ');

export const supabase = configured
  ? createClient(url, key, {
      auth: {
        persistSession:    true,
        autoRefreshToken:  true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const supabaseAvailable = configured;
