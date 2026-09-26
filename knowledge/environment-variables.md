# Environment Variables Guide

All environment variables are validated at runtime and build time using Zod in `src/lib/env.ts`.

## Client-Side Variables (`NEXT_PUBLIC_`)

These variables are baked into the browser bundle:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Base application URL | `http://localhost:3000` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Publishable Key | `pk_test_...` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Catch-all sign-in route | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Catch-all sign-up route | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Redirect target post sign-in | `/dashboard` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Redirect target post sign-up | `/dashboard` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://[ref].supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | `eyJhbGciOi...` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud-name` |

## Server-Only Variables

These variables must **NEVER** be prefixed with `NEXT_PUBLIC_` and are kept strictly server-side:

| Variable | Description | Source / Purpose |
| :--- | :--- | :--- |
| `CLERK_SECRET_KEY` | Clerk API Secret Key | Clerk Dashboard -> API Keys |
| `DATABASE_URL` | Postgres connection string (port 6543 pooled or 5432 direct) | Supabase Dashboard -> Settings -> Database |
| `DIRECT_URL` | Postgres direct connection string (port 5432) | Used for Drizzle migrations |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase backend admin key | Supabase Dashboard -> Settings -> API |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL (Optional) | Upstash Console -> Details -> REST API |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST Token (Optional) | Upstash Console -> Details -> REST API |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | Cloudinary Console |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | Cloudinary Console |
| `CLOUDINARY_URL` | Full Cloudinary connection string | Cloudinary Console |
| `OPENAI_API_KEY` | (Optional) OpenAI API Key | OpenAI Platform |
| `ANTHROPIC_API_KEY` | (Optional) Anthropic API Key | Anthropic Console |

## Security Rules

- `.env.local` is strictly ignored by Git and never committed.
- `.env.example` is committed and tracked as the single reference for required variables.
