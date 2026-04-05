import { createClient } from '@supabase/supabase-js';

// Try to get VITE_ prefixed variables (standard for Vite)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Prevent the app from crashing if keys are missing
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({} as any, {
      get: (target, prop) => {
        const errorMessage = 'Supabase configuration is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the Settings menu.';
        
        if (prop === 'auth') {
          return {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: (callback: any) => {
              // Call the callback immediately with an initial state to trigger state updates in components
              setTimeout(() => callback('INITIAL_SESSION', null), 0);
              return { data: { subscription: { unsubscribe: () => {} } } };
            },
            signInWithPassword: async () => { throw new Error(errorMessage); },
            signInWithOAuth: async () => { throw new Error(errorMessage); },
            signOut: async () => { throw new Error(errorMessage); },
            signUp: async () => { throw new Error(errorMessage); },
          };
        }
        
        if (prop === 'from') {
          return () => ({
            select: () => ({
              order: () => ({
                limit: () => Promise.resolve({ data: [], error: new Error(errorMessage) })
              })
            })
          });
        }
        
        return undefined;
      }
    });
