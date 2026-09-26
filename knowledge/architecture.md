# Architecture Overview — PraviAI Universal Insurance Repository

## 1. High-Level Universal Architecture

The repository provides a single, unified architecture that cleanly separates product presentation, persistent storage, ephemeral coordination, AI capabilities, and an optional classical ML escape hatch:

```text
                     PRAVIAI
                        │
             ┌──────────┴──────────┐
             │                     │
          PRODUCT                 AI
             │                     │
          Next.js              AI SDK
             │                     │
    ┌────────┼────────┐      ┌─────┴─────┐
    │        │        │      │           │
  Clerk   Supabase  Cloudinary LangChain LangGraph
             │                     │           │
          Drizzle               RAG         Agents
             │                     │           │
          pgvector             Embeddings    Tools
             │                     │           │
             └──────────┬──────────┴───────────┘
                        │
                     Upstash
                  ┌─────┴─────┐
                  │           │
                Redis       QStash
                  │           │
               Cache      Background
                         workflows
                        │
                        ▼
                     Vercel


             OPTIONAL ML ESCAPE HATCH

                     Next.js
                        │
                     HTTP
                        │
                   FastAPI
                        │
          ┌─────────────┼─────────────┐
          │             │             │
       sklearn       PyTorch      Transformers
          │             │             │
          └─────────────┼─────────────┘
                        │
                      MLflow
```

---

## 2. Explicit Database & AI State Separation

Every data tier has a strict, unambiguous responsibility:

| Tier | Technology | Canonical Role | Notes |
| :--- | :--- | :--- | :--- |
| **Persistent Source of Truth** | **Supabase PostgreSQL** | User accounts, transactions, application records, relations | Always query via Drizzle ORM |
| **Relational Schema Layer** | **Drizzle ORM** | Type-safe SQL builder, migrations, relations | Zero runtime overhead |
| **Semantic Retrieval Layer** | **Supabase pgvector** | Vector columns, document embeddings, HNSW similarity search | Co-located in PostgreSQL, no third-party vector DB needed |
| **Ephemeral & Fast Cache** | **Upstash Redis** | Cache query results, rate limiting, distributed locks | Serverless REST client (`@/lib/redis`) |
| **Asynchronous Jobs & Crons** | **Upstash QStash** | Delayed tasks, long-running agent workflows, guaranteed retries | Serverless REST client (`@/lib/qstash`) |
| **Server State Synchronization** | **TanStack Query** | Caching, invalidating, refetching server data in the browser | Wraps client components |
| **Structured Presentation** | **TanStack Table** | Headless sorting, filtering, row selection, pagination | Styled with shadcn/ui |
| **Speech & Audio** | **Deepgram** | Speech-to-Text (Nova-2/Nova-3) & Text-to-Speech (Aura) | Ephemeral token pattern for zero-secret client streaming |

---

## 3. Standard Data Flow Pipeline

For data-heavy UI, follow the established decoupled standard:

```text
TanStack Query
      ↓ (Fetches, caches, & synchronizes server state)
Server Actions / API / Drizzle
      ↓ (Queries Supabase PostgreSQL with optional Upstash Redis caching)
TanStack Table
      ↓ (Manages sorting, filtering, selection, and pagination headlessly)
shadcn/ui + Tailwind CSS
      (Renders clean, accessible presentation markup)
```

### Dataset Scaling Strategy

- **Large Datasets (>100 rows)**: Always use server-side pagination, sorting, and filtering (`manualPagination: true`). Fetch only required slices using SQL `limit` and `offset`.
- **Small Datasets (<100 rows)**: Fetch the complete dataset with TanStack Query and leverage client-side table models (`getSortedRowModel`, `getFilteredRowModel`, `getPaginationRowModel`).

---

## 4. Shallow Directory Layout

```text
├── src/
│   ├── app/                 # Next.js App Router pages and layouts
│   │   ├── (auth)/          # Clerk sign-in and sign-up catch-all routes
│   │   ├── dashboard/       # Reusable dashboard shell (sidebar, header, canvas)
│   │   ├── globals.css      # Tailwind v4 & OKLCH color token definitions
│   │   ├── layout.tsx       # Root layout with Clerk, Theme, & Query providers
│   │   └── page.tsx         # Landing page shell
│   ├── components/          # Shared components
│   │   ├── ui/              # shadcn/ui components (button, card, input, dialog, etc.)
│   │   ├── theme-provider.tsx
│   │   ├── theme-toggle.tsx
│   │   └── query-provider.tsx
│   ├── db/                  # Database infrastructure
│   │   ├── index.ts         # Drizzle connection with Supabase pooler support
│   │   └── schema.ts        # Drizzle table schemas
│   ├── lib/                 # Core utilities
│   │   ├── cloudinary.ts    # Cloudinary SDK and signed upload helpers
│   │   ├── env.ts           # Zod environment validation (supports optional AI/ML keys)
│   │   ├── qstash.ts        # Upstash QStash client & webhook receiver
│   │   ├── redis.ts         # Upstash Redis REST client (ephemeral state/caching)
│   │   ├── supabase/        # Browser and admin Supabase clients
│   │   └── utils.ts         # cn() className merger
│   └── proxy.ts             # Next.js proxy middleware (Clerk session handler)
├── skills/                  # 48 actionable AI agent domain skills
├── knowledge/               # Durable architectural reference documents
├── tests/                   # Vitest unit tests and Playwright E2E tests
├── drizzle.config.ts        # Drizzle Kit CLI configuration
└── biome.json               # Biome linter/formatter configuration
```
