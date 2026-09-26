# Skill: Next.js (App Router)

## When to Use

Use when creating routes, pages, layouts, server actions, route handlers, or middleware/proxy in this Next.js project.

## Important Conventions

- **App Router**: Place routes in `src/app/`.
- **Server Components by Default**: Only add `"use client"` when state, browser APIs, or client-side interactivity is necessary.
- **Proxy/Middleware**: Next.js uses `src/proxy.ts` (the modern successor to `src/middleware.ts`).
- **Data Fetching**: Fetch data directly in Server Components using Drizzle queries or Server Actions; avoid redundant client-side fetching wrappers where server rendering suffices.
- **Font & Metadata**: Use `next/font` and Next.js `metadata` API in `layout.tsx` / `page.tsx`.

## Things to Avoid

- Do NOT use Pages router (`pages/`).
- Do NOT turn entire pages into Client Components when only a subcomponent needs interactivity.
- Do NOT write heavy logic directly in `proxy.ts`; keep proxy lightweight.
- Do NOT use `fetch()` to call internal API routes from Server Components; query the database directly.

## Relevant Commands

```bash
bun run dev          # Start Next.js development server
bun run build        # Production build with Turbopack
bun run start        # Start production server
```
