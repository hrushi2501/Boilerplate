# Skill: Hackathon Development

## When to Use

Use throughout any hackathon sprint to prioritize velocity, focus, and rapid shipping over over-engineering.

## Core Tenets

1. **Speed > Complexity**: Pick the simplest pattern that achieves the goal reliably.
2. **Reusability > Over-engineering**: Leverage pre-built components in `src/components/ui/` and standard utilities in `src/lib/`.
3. **Working Infrastructure > Demo Features**: Build actual functional features on top of working auth, database, and UI systems rather than mock data.
4. **No Deep Nesting**: Keep folder structures shallow and straightforward (`src/components`, `src/lib`, `src/db`, `src/app`).

## Development Checklist

- [ ] Add actual secrets to `.env.local` (Clerk, Supabase, Cloudinary).
- [ ] Add tables to `src/db/schema.ts` and run `bun run db:push`.
- [ ] Add core product components into `src/app/dashboard/`.
- [ ] Verify build with `bun run check && bun run typecheck && bun run build`.
- [ ] Deploy to Vercel in minutes.

## Things to Avoid

- Do NOT spend hours debating micro-optimizations or rewriting configuration.
- Do NOT build fake charts, fake business stats, or fake data models.
- Do NOT introduce unvetted heavy dependencies that break builds.
