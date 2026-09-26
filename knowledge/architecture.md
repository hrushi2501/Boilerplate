# Architecture Overview

## High-Level Topology

The boilerplate is built on a clean, scalable Next.js App Router architecture optimized for hackathon speed and production readiness:

```text
[ Browser / Client ]
      │
      ▼
[ Next.js App Router (Turbopack) ]
      ├── Proxy / Middleware (src/proxy.ts - Clerk Auth)
      ├── Server Components (Default data fetching & rendering)
      ├── Route Handlers & Server Actions (src/app/api & actions)
      └── Client Components (shadcn/ui + TanStack Query + TanStack Table)
      │
      ├───┬──────────────────────┬──────────────────────┬──────────────────────┐
      ▼   ▼                      ▼                      ▼                      ▼
[ Supabase PostgreSQL ]   [ Upstash Redis ]       [ Clerk Auth ]        [ Cloudinary ]
(Primary persistent DB)   (Ephemeral cache/locks) (User identity)       (Media CDN)
```

## Standard Data Flow Pipeline

For data-heavy UI, follow the established decoupled standard:

```text
TanStack Query
      ↓ (Fetches, caches, & synchronizes server state)
Server Actions / API / Drizzle
      ↓ (Queries Supabase PostgreSQL with optional Upstash caching)
TanStack Table
      ↓ (Manages sorting, filtering, selection, and pagination headlessly)
shadcn/ui + Tailwind
      (Renders clean, accessible presentation markup)
```

### Dataset Scaling Strategy

- **Large Datasets (>100 rows)**: Always use server-side pagination, sorting, and filtering (`manualPagination: true`). Fetch only required slices using SQL `limit` and `offset`. Avoid loading thousands of rows into the browser.
- **Small Datasets (<100 rows)**: Fetch the complete dataset with TanStack Query and leverage client-side table models (`getSortedRowModel`, `getFilteredRowModel`, `getPaginationRowModel`).

## Shallow Directory Layout

```text
├── src/
│   ├── app/                 # Next.js App Router pages and layouts
│   │   ├── (auth)/          # Clerk sign-in and sign-up catch-all routes
│   │   ├── dashboard/       # Reusable dashboard shell (sidebar, header, canvas)
│   │   ├── globals.css      # Tailwind v4 & OKLCH color token definitions
│   │   ├── layout.tsx       # Root layout with Clerk, Theme, & Query providers
│   │   └── page.tsx         # Landing page shell
│   ├── components/          # Shared components
│   │   └── ui/              # shadcn/ui components (button, card, input, etc.)
│   ├── db/                  # Database infrastructure
│   │   ├── index.ts         # Drizzle connection with Supabase pooler support
│   │   └── schema.ts        # Drizzle table schemas
│   ├── lib/                 # Core utilities
│   │   ├── cloudinary.ts    # Cloudinary SDK and signed upload helpers
│   │   ├── env.ts           # Zod environment validation
│   │   ├── redis.ts         # Upstash Redis REST client (ephemeral state/caching)
│   │   ├── supabase/        # Browser and admin Supabase clients
│   │   └── utils.ts         # cn() className merger
│   └── proxy.ts             # Next.js proxy middleware (Clerk session handler)
├── skills/                  # Concise, actionable AI agent skills
├── knowledge/               # Durable architectural knowledge documents
├── tests/                   # Vitest unit tests and Playwright E2E tests
├── drizzle.config.ts        # Drizzle Kit CLI configuration
└── biome.json               # Biome linter/formatter configuration
```
