'use client';
import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';

export function AuthProvider() {
  const { setUser } = useStore();

  useEffect(() => {
    if (!supabase) return;

    // Restore session on mount
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setUser(data.session.user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
}
