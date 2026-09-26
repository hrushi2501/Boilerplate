# Pravi AI — Reusable Hackathon Boilerplate

A production-ready, batteries-included Next.js hackathon boilerplate designed to eliminate setup fatigue so you can immediately start building your product.

Repository: [https://github.com/hrushi2501/PraviAI](https://github.com/hrushi2501/PraviAI)

---

## 🚀 Hackathon Quick Start (Build in 3 Minutes)

```bash
# 1. Clone the repository
git clone https://github.com/hrushi2501/PraviAI.git
cd PraviAI

# 2. Install dependencies with Bun
bun install

# 3. Configure environment variables
cp .env.example .env.local
# Open .env.local and paste your Clerk, Supabase, and Cloudinary keys

# 4. Define your tables in src/db/schema.ts and push to your database
bun run db:push

# 5. Start the development server
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the landing shell, and [http://localhost:3000/dashboard](http://localhost:3000/dashboard) to start building your product features.

---

## 🛠 Core Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **[Next.js](https://nextjs.org)** (App Router) | React Framework with Turbopack, Server Components, and Server Actions |
| **[Bun](https://bun.sh)** | Ultra-fast package manager and JavaScript runtime |
| **[TypeScript](https://www.typescriptlang.org)** | Strict-mode static typing |
| **[Tailwind CSS v4](https://tailwindcss.com)** | Utility-first CSS engine with OKLCH theme variables |
| **[shadcn/ui](https://ui.shadcn.com)** | Accessible, customizable UI component system |
| **[Biome](https://biomejs.dev)** | High-speed formatter and linter replacing ESLint & Prettier |
| **[Supabase](https://supabase.com)** | Managed PostgreSQL database infrastructure (Primary source of truth) |
| **[Drizzle ORM](https://orm.drizzle.team)** | Lightweight, type-safe SQL query builder and schema engine |
| **[Upstash Redis](https://upstash.com)** | Serverless Redis REST client for fast caching, rate limiting, and counters |
| **[Clerk](https://clerk.com)** (Core 3) | Turnkey authentication, session security, and profile components |
| **[Cloudinary](https://cloudinary.com)** | Media management, CDN delivery, and automatic image optimization |
| **[TanStack Query](https://tanstack.com/query)** | Remote server-state management and data caching |
| **[TanStack Table](https://tanstack.com/table)** | Headless table engine for sorting, filtering, selection, and pagination |
| **[Vitest](https://vitest.dev) & [Playwright](https://playwright.dev)** | Unit and end-to-end browser smoke testing |
| **[Vercel](https://vercel.com)** | Zero-configuration deployment platform |

---

## 📁 Repository Structure

```text
├── src/
│   ├── app/                 # Next.js App Router (pages, layouts, auth catch-alls)
│   │   ├── (auth)/          # Clerk sign-in / sign-up routes
│   │   ├── dashboard/       # Customizable dashboard shell (nav, header, canvas)
│   │   ├── layout.tsx       # Root layout (Clerk, Theme, & Query providers)
│   │   └── page.tsx         # Clean landing shell
│   ├── components/          # Reusable React components
│   │   ├── ui/              # shadcn/ui primitives (button, card, input, dialog, etc.)
│   │   ├── theme-provider.tsx
│   │   ├── theme-toggle.tsx
│   │   └── query-provider.tsx
│   ├── db/                  # Database infrastructure
│   │   ├── index.ts         # Drizzle client with Supabase pooler handling
│   │   └── schema.ts        # Database schemas
│   ├── lib/                 # Core utilities
│   │   ├── cloudinary.ts    # Cloudinary SDK & signed upload helpers
│   │   ├── env.ts           # Zod environment variable validation
│   │   ├── redis.ts         # Upstash Redis REST client (ephemeral state/caching)
│   │   ├── supabase/        # Browser and admin Supabase clients
│   │   └── utils.ts         # cn() utility
│   └── proxy.ts             # Next.js proxy middleware (Clerk session management)
├── skills/                  # Actionable AI agent domain skills
├── knowledge/               # Durable architectural reference guides
├── tests/                   # Vitest unit tests & Playwright smoke tests
├── drizzle.config.ts        # Drizzle Kit CLI configuration
└── biome.json               # Biome linter/formatter rules
```

---

## 🔑 Environment Variables

Copy `.env.example` to `.env.local` and provide your credentials:

```bash
# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Clerk Auth (https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Supabase (https://supabase.com/dashboard)
NEXT_PUBLIC_SUPABASE_URL="https://[project-ref].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Database Connection (Supabase Settings -> Database)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"

# Upstash Redis (https://console.upstash.com) - Optional
UPSTASH_REDIS_REST_URL="https://[endpoint].upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"

# Cloudinary (https://cloudinary.com/console)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

> **Security Note**: `.env.local` is strictly ignored by Git. Never commit real credentials.

---

## ⚡️ Available Commands

### Development

```bash
bun run dev          # Start local dev server at http://localhost:3000
bun run build        # Build production application bundle
bun run start        # Start production server
```

### Code Quality & Formatting

```bash
bun run check        # Run Biome lint, format, and import check
bun run format       # Auto-format codebase with Biome
bun run typecheck    # Validate TypeScript types (tsc --noEmit)
```

### Database & Drizzle ORM

```bash
bun run db:push      # Push schema directly to Supabase Postgres (Hackathon speed)
bun run db:generate  # Generate migration SQL files
bun run db:migrate   # Apply migrations to database
bun run db:studio    # Open interactive Drizzle Studio in browser
```

### Testing

```bash
bun run test         # Run unit tests via Vitest
bun run test:watch   # Run unit tests in watch mode
bun run test:e2e     # Run Playwright end-to-end tests
```

---

## 🤖 Agent & Skills Workflow

This repository is optimized for autonomous coding with **Antigravity** and **Codex**:

- **`AGENTS.md`** is the canonical source of truth for all coding agents.
- **`skills/`** contains 24 actionable domain skills (Next.js, Drizzle, Clerk, Biome, UI design, security, etc.).
- **`knowledge/`** contains 8 durable architectural decisions and conventions.

Agents follow the resolution hierarchy: **`AGENTS.md` → `skills/` → `knowledge/`**.

---

## 🚢 Deployment (Vercel)

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set the Framework Preset to **Next.js**.
4. Add all environment variables from `.env.example` in Vercel Project Settings.
5. Deploy.
