# AGENTS.md — Canonical AI Agent Instructions

> **Notice for AI Coding Agents (Antigravity, Codex, etc.)**:
> This document is the single canonical source of truth for all coding agents operating in this repository.
> Follow the established hierarchy:
> **AGENTS.md** → **skills/** → **knowledge/**
> Do NOT invent new architecture, alternative frameworks, or conflicting directory structures.
> **Rule**: Agents MUST read the relevant skill file before making substantial changes in that domain.

---

## 1. Core Stack & Decisions

- **Package Manager**: **Bun** (Always use `bun add`, `bun run`, `bun test`; do NOT use npm or yarn unless strictly required).
- **Framework**: **Next.js (App Router)** with TypeScript in strict mode.
- **Formatter & Linter**: **Biome** (ESLint and Prettier are explicitly NOT used).
- **Primary Database**: **Supabase PostgreSQL** via pooled or direct connection strings.
- **ORM**: **Drizzle ORM** (`drizzle-orm`, `drizzle-kit`).
- **Cache & Ephemeral Layer**: **Upstash Redis** (`@upstash/redis` REST client) for caching, rate limiting, and counters.
- **Server State Management**: **TanStack Query** (`@tanstack/react-query`).
- **Table Engine**: **TanStack Table** (`@tanstack/react-table`) styled with shadcn/ui.
- **Authentication**: **Clerk** (`@clerk/nextjs` Core 3 with `<Show when="...">` and server-side `auth()`).
- **Deployment**: **Vercel** (zero-config Next.js preset).
- **Styling & UI**: **Tailwind CSS v4** + **shadcn/ui** + **Lucide React**.
- **Media CDN**: **Cloudinary** (`next-cloudinary` & server SDK).
- **Testing**: **Vitest** (unit tests) + **Playwright** (E2E smoke tests).

---

## 2. Hackathon Default Decision Tree

When implementing any requirement, follow this decision tree:

| Need | Preferred Solution |
| :--- | :--- |
| **Persistent relational data?** | **Supabase PostgreSQL + Drizzle ORM** |
| **Fast temporary / cache / rate-limit state?** | **Upstash Redis** (`@/lib/redis`) |
| **Fetching, caching, & synchronizing server data?** | **TanStack Query** (`@tanstack/react-query`) |
| **Displaying structured data grids / tables?** | **TanStack Table** (`@tanstack/react-table` + shadcn/ui) |
| **User authentication & session security?** | **Clerk** (`@clerk/nextjs`) |
| **Media storage, transformation, & CDN delivery?** | **Cloudinary** (`@/lib/cloudinary` + `next-cloudinary`) |
| **Hosting & automated deployment?** | **Vercel** |
| **User interface components & styling?** | **shadcn/ui + Tailwind CSS + Lucide React** |
| **Polished visual enhancements?** | **21st.dev / React Bits / Emil Design / Ponytail (selectively)** |
| **Code formatting & linting?** | **Biome** (`bun run check`, `bun run format`) |
| **Package management & runtime?** | **Bun** |

---

## 3. Non-Negotiable Operational Rules

1. **Inspect Before Modifying**: Always read existing files and check Git status before changing anything.
2. **Never Expose Secrets**: Never commit `.env.local` or write hardcoded API keys. All keys belong in environment variables validated through `src/lib/env.ts`. Keep Redis, Supabase service role, and Clerk secret keys strictly on the server.
3. **No Unnecessary Animation**: React Bits and micro-interactions must be applied **selectively**. Only use animation when it clearly enhances user comprehension.
4. **No Gratuitous Dependencies**: Do not install packages just because they might be useful later. Keep the dependency footprint lean.
5. **No Deep Folder Nesting**: Maintain a shallow hierarchy (`src/app`, `src/components`, `src/db`, `src/lib`).
6. **Prefer Small, Focused Changes**: Implement atomic modifications. Do not rewrite large working sections.
7. **Post-Change Validation Cycle**: After any modification, always execute:

   ```bash
   bun run check      # Verify formatting, imports, and linter rules with Biome
   bun run typecheck  # Verify TypeScript compilation with tsc --noEmit
   bun run test       # Run unit test suite
   ```

8. **Preserve Established Conventions**: Never switch from Biome to ESLint, or from Drizzle to Prisma, or from Clerk to custom auth.

---

## 4. Skill & Knowledge Dispatch Map

Agents **must consult the relevant skill** before performing specialized work:

| Task Domain | Canonical Skill File | Durable Knowledge Reference |
| :--- | :--- | :--- |
| Next.js App Router, routing, proxy | [`skills/nextjs.md`](skills/nextjs.md) | [`knowledge/architecture.md`](knowledge/architecture.md) |
| TypeScript types, interfaces, schemas | [`skills/typescript.md`](skills/typescript.md) | [`knowledge/stack-decisions.md`](knowledge/stack-decisions.md) |
| React components, hooks, local state | [`skills/react.md`](skills/react.md) | [`knowledge/architecture.md`](knowledge/architecture.md) |
| Server state, fetching, mutations | [`skills/tanstack-query.md`](skills/tanstack-query.md) | [`knowledge/architecture.md`](knowledge/architecture.md) |
| Tables, data grids, sorting, pagination | [`skills/tanstack-table.md`](skills/tanstack-table.md) | [`knowledge/database-conventions.md`](knowledge/database-conventions.md) |
| Ephemeral cache, rate limits, locks | [`skills/upstash-redis.md`](skills/upstash-redis.md) | [`knowledge/database-conventions.md`](knowledge/database-conventions.md) |
| Supabase Postgres & Storage | [`skills/supabase.md`](skills/supabase.md) | [`knowledge/database-conventions.md`](knowledge/database-conventions.md) |
| Drizzle ORM, migrations, schemas | [`skills/drizzle.md`](skills/drizzle.md) | [`knowledge/database-conventions.md`](knowledge/database-conventions.md) |
| Tailwind styling, responsive classes | [`skills/tailwind.md`](skills/tailwind.md) | [`knowledge/ui-conventions.md`](knowledge/ui-conventions.md) |
| shadcn/ui components & primitives | [`skills/shadcn.md`](skills/shadcn.md) | [`knowledge/ui-conventions.md`](knowledge/ui-conventions.md) |
| Biome linting, formatting, imports | [`skills/biome.md`](skills/biome.md) | `biome.json` |
| Clerk Authentication & guards | [`skills/clerk.md`](skills/clerk.md) | [`knowledge/security-conventions.md`](knowledge/security-conventions.md) |
| Vercel deployment & production env | [`skills/vercel.md`](skills/vercel.md) | [`knowledge/deployment-conventions.md`](knowledge/deployment-conventions.md) |
| Cloudinary uploads & image optimization | [`skills/cloudinary.md`](skills/cloudinary.md) | [`knowledge/environment-variables.md`](knowledge/environment-variables.md) |
| UI design, 21st.dev, Emil, Ponytail | [`skills/ui-design.md`](skills/ui-design.md) | [`knowledge/ui-conventions.md`](knowledge/ui-conventions.md) |
| Accessibility, ARIA, focus rings | [`skills/accessibility.md`](skills/accessibility.md) | [`knowledge/ui-conventions.md`](knowledge/ui-conventions.md) |
| Responsive layouts & mobile drawer | [`skills/responsive-design.md`](skills/responsive-design.md) | [`knowledge/ui-conventions.md`](knowledge/ui-conventions.md) |
| Unit testing & E2E smoke tests | [`skills/testing.md`](skills/testing.md) | `tests/` |
| Security, RLS, input hygiene | [`skills/security.md`](skills/security.md) | [`knowledge/security-conventions.md`](knowledge/security-conventions.md) |
| Server Actions & API route design | [`skills/api-design.md`](skills/api-design.md) | [`knowledge/architecture.md`](knowledge/architecture.md) |
| Postgres schema design & indexing | [`skills/database-design.md`](skills/database-design.md) | [`knowledge/database-conventions.md`](knowledge/database-conventions.md) |
| AI SDK, LLM streaming, agents | [`skills/ai-sdk.md`](skills/ai-sdk.md) | [`skills/agents.md`](skills/agents.md) |
| Hackathon rapid shipping playbook | [`skills/hackathon-development.md`](skills/hackathon-development.md) | [`knowledge/hackathon-workflow.md`](knowledge/hackathon-workflow.md) |

---

## 5. Key CLI Commands

```bash
# Development & Build
bun run dev           # Start Next.js development server
bun run build         # Build production bundle with Turbopack
bun run start         # Start production server

# Code Quality & Format
bun run check         # Run Biome checks (formatting + linter + imports)
bun run format        # Run Biome formatter write
bun run typecheck     # Validate strict TypeScript types

# Database & Migrations
bun run db:push       # Push schema changes directly to Supabase DB (rapid mode)
bun run db:generate   # Generate Drizzle migration files
bun run db:migrate    # Apply Drizzle migrations
bun run db:studio     # Launch Drizzle Studio

# Testing
bun run test          # Run Vitest unit tests
bun run test:e2e      # Run Playwright E2E tests
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
