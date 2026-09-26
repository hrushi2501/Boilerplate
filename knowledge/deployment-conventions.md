# Deployment Conventions (Vercel)

## Deployment Target

The boilerplate is designed for instant zero-config deployment to **Vercel**.

## Pre-Deployment Verification

Before pushing to production or opening a pull request, run the local verification suite:

```bash
bun run check        # Biome linting and formatting
bun run typecheck    # TypeScript compiler check
bun run test         # Vitest unit test suite
bun run build        # Production Next.js build
```

## Vercel Project Setup

1. Import repository from GitHub (`hrushi2501/PraviAI`).
2. Framework preset: **Next.js**.
3. Package manager: **Bun**.
4. Configure Environment Variables in Vercel Project Settings matching `.env.example`:
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
5. Click **Deploy**.
