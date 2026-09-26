import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase Browser Client
 *
 * Use this in Client Components for Supabase Storage, Realtime, or public queries.
 * Note: Clerk handles user authentication; Supabase is used for database & storage infrastructure.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
