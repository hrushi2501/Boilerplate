# PraviAI — Ultimate Universal Hackathon Insurance Repository

A production-quality, hackathon-ready universal foundation designed to eliminate boilerplate fatigue so you can immediately build and ship your product.

Whether your hackathon challenge is a standard B2B SaaS, an interactive dashboard, an AI chatbot, a RAG system, multi-agent workflows, multimodal document intelligence, real-time voice streaming, or classical machine learning, **PraviAI provides the pre-architected, zero-debt foundation**.

Repository: [https://github.com/hrushi2501/PraviAI](https://github.com/hrushi2501/PraviAI)  
Live Deployment: [https://praviai.vercel.app](https://praviai.vercel.app)

---

## ⚡️ The Hackathon Philosophy

```text
CLONE  ──►  CONFIGURE ENV  ──►  START BUILDING
```

**Not:** `CLONE ──► UNDERSTAND A MASSIVE FRAMEWORK ──► START BUILDING`

The repository is lightweight and completely usable for a normal non-AI hackathon without bloat, while offering modular plug-and-play skills and architecture for advanced AI and machine learning when required.

---

## 🚀 Hackathon Quick Start (Ship in Minutes)

```bash
# 1. Clone the repository
git clone https://github.com/hrushi2501/PraviAI.git
cd PraviAI

# 2. Install dependencies with Bun
bun install

# 3. Configure environment variables
cp .env.example .env.local
# Open .env.local and add your Clerk, Supabase, and service credentials

# 4. Push database tables (rapid mode)
bun run db:push

# 5. Start development server
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000) for the landing page shell, and [http://localhost:3000/dashboard](http://localhost:3000/dashboard) to build your product.

---

## 🛠 Core Tech Stack (Frozen)

| Layer | Canonical Technology | Purpose |
| :--- | :--- | :--- |
| **Runtime & Package Manager** | **[Bun](https://bun.sh)** | Ultra-fast execution, instant package installation (`bun add`) |
| **Framework** | **[Next.js](https://nextjs.org)** (App Router) | Server Components, Server Actions, Route Handlers, Turbopack |
| **Language** | **[TypeScript](https://www.typescriptlang.org)** | Strict-mode static typing |
| **Formatter & Linter** | **[Biome](https://biomejs.dev)** | High-speed single tool replacing ESLint & Prettier (`bun run check`) |
| **Primary Database** | **[Supabase](https://supabase.com)** (PostgreSQL) | Relational source of truth with pooled connection strings |
| **ORM** | **[Drizzle ORM](https://orm.drizzle.team)** | Type-safe SQL schema definitions & migrations (`drizzle-kit`) |
| **Vector Search** | **Supabase pgvector** | Co-located vector storage & HNSW similarity search |
| **Authentication** | **[Clerk](https://clerk.com)** (Core 3) | Prebuilt auth UI, session security, and server-side `auth()` |
| **Server State** | **[TanStack Query](https://tanstack.com/query)** | Asynchronous server-state fetching, caching, and invalidation |
| **Tables & Grids** | **[TanStack Table](https://tanstack.com/table)** | Headless sorting, filtering, and server-side pagination |
| **Cache & Locks** | **[Upstash Redis](https://upstash.com)** | Ephemeral cache, rate limiting, and distributed locks (`@/lib/redis`) |
| **Background Jobs & Crons** | **[Upstash QStash](https://upstash.com)** | Serverless async jobs, agent execution, and retries (`@/lib/qstash`) |
| **UI Styling** | **[Tailwind CSS v4](https://tailwindcss.com)** + **[shadcn/ui](https://ui.shadcn.com)** | OKLCH color tokens, accessible primitives, Lucide icons |
| **Media CDN** | **[Cloudinary](https://cloudinary.com)** | Direct uploads, automatic image transformation, and media CDN |
| **Speech AI** | **[Deepgram](https://deepgram.com)** | Real-time speech-to-text (Nova-2/Nova-3) & text-to-speech (Aura) |
| **Testing** | **[Vitest](https://vitest.dev)** & **[Playwright](https://playwright.dev)** | Fast unit testing and browser smoke testing |
| **Deployment** | **[Vercel](https://vercel.com)** | Zero-config edge and serverless deployment |

---

## 🧠 AI & Agent Capabilities (Modular & Optional)

The AI stack is architected into 5 progressive levels. You only activate what your hackathon project needs:

1. **Level 1 — Simple AI & Chatbots**: Vercel AI SDK (`ai`), streaming completions, structured JSON generation (`generateObject`), and single-turn tool calling.
2. **Level 2 — RAG & Knowledge Bases**: Supabase `pgvector` with HNSW cosine similarity search, chunking pipelines, and OpenAI/Gemini embeddings.
3. **Level 3 — Stateful Agents**: LangGraph (`@langchain/langgraph`) state machines with conditional branching, evaluator-optimizer loops, and human-in-the-loop approval.
4. **Level 4 — Long-Running Workflows**: LangGraph + Upstash QStash for asynchronous, durable background tasks that exceed standard HTTP timeout limits.
5. **Level 5 — Voice & Speech Intelligence**: Deepgram Nova-2/Nova-3 real-time STT and Aura low-latency TTS streaming.
6. **ML Escape Hatch**: Decoupled Python microservice (`ml/`) running FastAPI for scikit-learn, PyTorch, and Hugging Face models without polluting the Node.js runtime.

---

## 🏛 System Architecture

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

## 📁 Repository Structure

```text
├── src/
│   ├── app/                 # Next.js App Router (pages, layouts, auth catch-alls)
│   │   ├── (auth)/          # Clerk sign-in / sign-up routes
│   │   ├── dashboard/       # Reusable dashboard shell (sidebar, header, canvas)
│   │   ├── layout.tsx       # Root layout with Clerk, Theme, and Query providers
│   │   ├── globals.css      # Tailwind v4 theme definitions & OKLCH variables
│   │   └── page.tsx         # Clean landing shell
│   ├── components/          # Reusable React components
│   │   ├── ui/              # shadcn/ui primitives (button, card, input, dialog, etc.)
│   │   ├── theme-provider.tsx
│   │   ├── theme-toggle.tsx
│   │   └── query-provider.tsx
│   ├── db/                  # Database infrastructure
│   │   ├── index.ts         # Drizzle connection with Supabase pooler handling
│   │   └── schema.ts        # Database schemas
│   ├── lib/                 # Core server & client utilities
│   │   ├── cloudinary.ts    # Cloudinary SDK & signed upload helpers
│   │   ├── env.ts           # Zod environment variable validation
│   │   ├── qstash.ts        # Upstash QStash client & webhook signature verification
│   │   ├── redis.ts         # Upstash Redis REST client (ephemeral state/caching)
│   │   ├── supabase/        # Browser and admin Supabase clients
│   │   └── utils.ts         # cn() className merger
│   └── proxy.ts             # Next.js proxy middleware (Clerk session management)
├── skills/                  # 48 actionable domain skills for AI coding agents
├── knowledge/               # Durable architectural and decision reference guides
├── tests/                   # Vitest unit tests & Playwright smoke tests
├── drizzle.config.ts        # Drizzle Kit CLI configuration
└── biome.json               # Biome linter/formatter rules
```

---

## ⚡️ Available Commands

### Development & Build

```bash
bun run dev          # Start local dev server at http://localhost:3000
bun run build        # Build production application bundle with Turbopack
bun run start        # Start production server
```

### Code Quality & Validation

```bash
bun run format       # Auto-format codebase with Biome
bun run check        # Run Biome lint, format, and import check
bun run typecheck    # Validate strict TypeScript types (tsc --noEmit)
bun run test         # Run unit tests via Vitest
bun run test:e2e     # Run Playwright end-to-end tests
```

### Database & Drizzle ORM

```bash
bun run db:push      # Push schema directly to Supabase Postgres (Hackathon speed)
bun run db:generate  # Generate migration SQL files
bun run db:migrate   # Apply migrations to database
bun run db:studio    # Open interactive Drizzle Studio in browser
```

---

## 🤖 Agent Operating Manual

This repository contains canonical instructions and 48 modular domain skills for coding agents (**Antigravity**, **Codex**, etc.):

- **`AGENTS.md`** is the single authoritative operating manual.
- **`CODEX.md`** and **`CLAUDE.md`** strictly point to `AGENTS.md`.
- Agents follow the strict resolution hierarchy: **`AGENTS.md` → `skills/` → `knowledge/` → Implementation**.
- Agents validate all changes through `bun run check && bun run typecheck && bun run test`.

---

## 🚢 Deployment (Vercel)

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Framework Preset: **Next.js**.
4. Populate environment variables from your `.env.local`.
5. Deploy.
