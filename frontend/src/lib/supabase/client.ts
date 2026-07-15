"use client";

import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client - uses the public anon key, safe to ship to the client.
// Row Level Security policies in Supabase are what actually protect the data at this layer;
// business logic and cross-table writes go through our own API (see lib/api.ts).
export function createSupabaseBrowserClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}
