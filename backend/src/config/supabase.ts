import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

// Server-side Supabase client using the SERVICE ROLE key.
// This bypasses Row Level Security - only ever use it in trusted backend code,
// never expose this key to the frontend (the frontend uses the anon key instead).
export const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
