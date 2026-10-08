import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  (import.meta.env as any).SUPABASE_URL ||
  "https://cnbnhfwvldgskpzfmifj.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  (import.meta.env as any).SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_S5LSbaNgwMQDbfhS5P7r5w_BXA_dMx3";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // PKCE returns OAuth results as ?code=... instead of #access_token=...,
    // which would otherwise collide with the app's hash-based router.
    flowType: "pkce",
  },
});
