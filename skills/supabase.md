# Skill: Supabase

## When to Use

Use when interacting with Supabase PostgreSQL, Supabase Storage buckets, or real-time event subscriptions.

## Data Layer Responsibility: Supabase vs. Upstash Redis

- **Supabase PostgreSQL is the primary persistent source of truth**: All relational models, users, business records, transactions, and durable state belong in Supabase PostgreSQL via Drizzle ORM.
- **Upstash Redis is an optional ephemeral/cache layer**: Redis is used strictly for short-lived caches, rate limiting, and counters.
- **Rule**: Never duplicate persistent PostgreSQL data into Redis without a concrete caching justification and defined TTL.

## Important Conventions

- **Database Infrastructure Role**: Supabase is used primarily as PostgreSQL database infrastructure and storage, NOT as the auth provider (Clerk is the auth provider).
- **Client Utilities**:
  - Browser/client: `createClient()` from `@/lib/supabase/client` (using anon key).
  - Server/admin: `createAdminClient()` from `@/lib/supabase/server` (using service role key).
- **Environment Variables**:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server-side only)
  - `DATABASE_URL` (direct or pooled postgres connection string)

## Things to Avoid

- Do NOT enable or duplicate Supabase Auth; authentication is strictly handled by Clerk.
- Do NOT expose `SUPABASE_SERVICE_ROLE_KEY` to client components.
- Do NOT bypass Row Level Security (RLS) policies when querying from client-side supabase clients.
