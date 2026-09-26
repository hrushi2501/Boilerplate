# Hackathon Rapid Development Workflow

## Target Velocity Strategy

This boilerplate eliminates setup fatigue so you can start writing core application logic immediately:

```text
Step 1: Clone & Configure
   git clone https://github.com/hrushi2501/PraviAI.git
   cp .env.example .env.local
   # Insert Clerk, Supabase, Cloudinary keys into .env.local

Step 2: Database Schema
   # Define product tables in src/db/schema.ts
   bun run db:push

Step 3: Build Product Features
   # Add pages in src/app/ or widgets inside src/app/dashboard/
   # Use shadcn components: bunx --bun shadcn@latest add <component> -y

Step 4: Quality & Validation
   bun run check && bun run typecheck && bun run build

Step 5: Ship & Demo
   git push origin main
   # Instant deployment via Vercel
```

## Quick Reference Commands

- **Dev Server**: `bun run dev`
- **Lint / Format**: `bun run check` / `bun run format`
- **Typecheck**: `bun run typecheck`
- **Database Push**: `bun run db:push`
- **Database Studio**: `bun run db:studio`
- **Test Suite**: `bun run test`
