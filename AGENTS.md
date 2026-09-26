# AGENTS.md — Canonical AI Agent Instructions

> **Notice for AI Coding Agents (Antigravity, Codex, etc.)**:
> This document is the single canonical source of truth for all coding agents operating in this repository.
> Follow the established hierarchy:
> **AGENTS.md** → **skills/** → **knowledge/** → **Implementation**
> Do NOT invent new architecture, alternative frameworks, or conflicting directory structures.
> **Rule**: Agents MUST read the relevant skill file before making substantial changes in that domain.

---

## 1. Agent Operating Hierarchy & Workflow

Coding agents must execute tasks using the following 9-step sequence:

```text
 1. Identify Domain       ──► Find relevant skill in skills/ and knowledge in knowledge/
 2. Consult Skill         ──► Read the skill file thoroughly before touching code
 3. Inspect Existing Code ──► Inspect git status, existing utilities, and schemas
 4. Reuse Architecture    ──► Leverage existing clients (db, redis, qstash, supabase, env)
 5. Implement Minimally   ──► Atomic, focused modifications; no gratuitous abstractions
 6. Run Unit Tests        ──► bun run test
 7. Biome Formatter/Lint  ──► bun run format && bun run check
 8. TypeScript Check      ──► bun run typecheck
 9. Production Build      ──► bun run build (when verifying overall application integrity)
```

Agents must **NOT** blindly install packages. Before installing any package, ask:

1. Is this capability already supported in the repository?
2. Can the existing frozen stack solve the problem cleanly?
3. Does this package introduce conflicting abstractions?
4. If not strictly required: **DO NOT INSTALL IT.**

---

## 2. Core Stack & Architecture (FROZEN)

The core technology choices are finalized and must not be replaced:

- **Package Manager & Runtime**: **Bun** (Always use `bun add`, `bun run`, `bun test`; never npm or yarn).
- **Framework**: **Next.js (App Router)** with TypeScript in strict mode.
- **Formatter & Linter**: **Biome** (ESLint and Prettier are explicitly NOT used).
- **Primary Database**: **Supabase PostgreSQL** via pooled or direct connection strings.
- **ORM**: **Drizzle ORM** (`drizzle-orm`, `drizzle-kit`).
- **Vector & Semantic Search**: **Supabase pgvector** (Do not install Pinecone, Weaviate, etc.).
- **Cache & Ephemeral Layer**: **Upstash Redis** (`@upstash/redis` REST client) for caching, rate limiting, and locks.
- **Background & Async Jobs**: **Upstash QStash** (`@upstash/qstash`, `src/lib/qstash.ts`) for long-running workflows, retries, and crons.
- **Server State Management**: **TanStack Query** (`@tanstack/react-query`).
- **Table Engine**: **TanStack Table** (`@tanstack/react-table`) styled with shadcn/ui.
- **Authentication**: **Clerk** (`@clerk/nextjs` Core 3 with `<Show when="...">` and server-side `auth()`).
- **Styling & UI**: **Tailwind CSS v4** + **shadcn/ui** + **Lucide React**.
- **Media CDN**: **Cloudinary** (`next-cloudinary` & server SDK).
- **Voice / Speech AI**: **Deepgram** (Nova-2/Nova-3 STT & Aura TTS via ephemeral token pattern).
- **AI Stack (Optional)**:
  - **Level 1 (Simple AI / Chat / Tools)**: Vercel AI SDK (`ai`).
  - **Level 2 (Workflows & Loaders)**: LangChain primitives + pgvector.
  - **Level 3 & 4 (Stateful & Long-Running Agents)**: LangGraph + Upstash QStash.
  - **Level 5 (Multi-Agent)**: Supervisor / Router / Specialist graphs.
- **ML Escape Hatch (Optional)**: Decoupled Python service with FastAPI (`ml/`). Never mix Python dependencies into Next.js.
- **Testing**: **Vitest** (unit tests) + **Playwright** (E2E smoke tests).
- **Deployment**: **Vercel** (zero-config Next.js preset).

---

## 3. Hackathon Default Decision Tree

| Need | Canonical Solution | Reference Skill |
| :--- | :--- | :--- |
| **Persistent relational data?** | **Supabase PostgreSQL + Drizzle ORM** | [`skills/drizzle.md`](skills/drizzle.md) |
| **Fast temporary / cache / rate limits?** | **Upstash Redis** (`@/lib/redis`) | [`skills/upstash-redis.md`](skills/upstash-redis.md) |
| **Background jobs / async agent execution?** | **Upstash QStash** (`@/lib/qstash`) | [`skills/qstash.md`](skills/qstash.md) |
| **Fetching & synchronizing server state?** | **TanStack Query** (`@tanstack/react-query`) | [`skills/tanstack-query.md`](skills/tanstack-query.md) |
| **Displaying structured data grids / tables?** | **TanStack Table** (`@tanstack/react-table` + shadcn/ui) | [`skills/tanstack-table.md`](skills/tanstack-table.md) |
| **User authentication & session security?** | **Clerk** (`@clerk/nextjs`) | [`skills/clerk.md`](skills/clerk.md) |
| **Media storage, transformation, & CDN?** | **Cloudinary** (`@/lib/cloudinary`) | [`skills/cloudinary.md`](skills/cloudinary.md) |
| **Speech-to-Text & Text-to-Speech?** | **Deepgram** (Nova-2/Nova-3 STT, Aura TTS) | [`skills/deepgram.md`](skills/deepgram.md) |
| **Simple AI chatbot / streaming / JSON?** | **Vercel AI SDK** (`ai`) | [`skills/ai-sdk.md`](skills/ai-sdk.md) |
| **Semantic search / RAG knowledge base?** | **Supabase pgvector + Embeddings** | [`skills/rag.md`](skills/rag.md), [`skills/vector-search.md`](skills/vector-search.md) |
| **Multi-step, cyclic, or branching agent?** | **LangGraph** (StateGraph) | [`skills/langgraph.md`](skills/langgraph.md) |
| **Document loaders & splitters?** | **LangChain** | [`skills/langchain.md`](skills/langchain.md) |
| **Standardized external tools?** | **Tool Calling / MCP** | [`skills/tool-calling.md`](skills/tool-calling.md), [`skills/mcp.md`](skills/mcp.md) |
| **Classical ML / Scikit-learn?** | **Decoupled FastAPI service** (`ml/`) | [`skills/python-ml.md`](skills/python-ml.md), [`skills/sklearn.md`](skills/sklearn.md) |
| **Deep Learning / PyTorch?** | **Decoupled FastAPI service** (`ml/`) | [`skills/pytorch.md`](skills/pytorch.md) |
| **Pretrained Hugging Face models?** | **HF Serverless Inference API** | [`skills/huggingface.md`](skills/huggingface.md) |
| **ML Experiment tracking?** | **MLflow** | [`skills/mlflow.md`](skills/mlflow.md) |
| **UI components & styling?** | **shadcn/ui + Tailwind CSS + Lucide** | [`skills/shadcn.md`](skills/shadcn.md), [`skills/tailwind.md`](skills/tailwind.md) |
| **Code formatting & linting?** | **Biome** (`bun run check`, `bun run format`) | [`skills/biome.md`](skills/biome.md) |
| **Hosting & automated deployment?** | **Vercel** | [`skills/vercel.md`](skills/vercel.md) |

---

## 4. Non-Negotiable Operational Rules

1. **Inspect Before Modifying**: Read existing files, verify environment types in `src/lib/env.ts`, and check Git status before changing anything.
2. **Never Expose Secrets**: Never commit `.env.local` or write hardcoded API keys. Keep Redis, Supabase service role, Clerk, QStash, Deepgram, and AI provider secret keys strictly on the server.
3. **No Infinite Agent Loops**: Every autonomous agent MUST have bounded termination (`maxSteps`, `maxIterations`). Never write `while(true)` agent loops.
4. **Decoupled Python ML**: Never install Python dependencies into Next.js. Classical ML and PyTorch belong in an external FastAPI service or serverless inference API.
5. **No Gratuitous Dependencies**: Do not install packages just because they might be useful later. Keep the footprint lean.
6. **No Deep Folder Nesting**: Maintain a shallow hierarchy (`src/app`, `src/components`, `src/db`, `src/lib`).
7. **Post-Change Validation Cycle**: After any modification, always execute:

   ```bash
   bun run check      # Verify formatting, imports, and linter rules with Biome
   bun run typecheck  # Verify TypeScript compilation with tsc --noEmit
   bun run test       # Run unit test suite
   ```

8. **Preserve Established Conventions**: Never switch from Biome to ESLint, from Drizzle to Prisma, or from Clerk to custom auth.

---

## 5. Complete Skill & Knowledge Dispatch Map

Agents **must consult the relevant skill** before performing specialized work:

| Task Domain | Canonical Skill File | Durable Knowledge Reference |
| :--- | :--- | :--- |
| **Next.js App Router, routing, proxy** | [`skills/nextjs.md`](skills/nextjs.md) | [`knowledge/architecture.md`](knowledge/architecture.md) |
| **TypeScript types & schemas** | [`skills/typescript.md`](skills/typescript.md) | [`knowledge/stack-decisions.md`](knowledge/stack-decisions.md) |
| **React components & local state** | [`skills/react.md`](skills/react.md) | [`knowledge/architecture.md`](knowledge/architecture.md) |
| **Server state & data synchronization** | [`skills/tanstack-query.md`](skills/tanstack-query.md) | [`knowledge/architecture.md`](knowledge/architecture.md) |
| **Tables, grids, pagination** | [`skills/tanstack-table.md`](skills/tanstack-table.md) | [`knowledge/database-conventions.md`](knowledge/database-conventions.md) |
| **Ephemeral cache, rate limits, locks** | [`skills/upstash-redis.md`](skills/upstash-redis.md) | [`knowledge/database-conventions.md`](knowledge/database-conventions.md) |
| **Background jobs, crons, async tasks** | [`skills/qstash.md`](skills/qstash.md) | [`knowledge/architecture.md`](knowledge/architecture.md) |
| **Supabase Postgres & Storage** | [`skills/supabase.md`](skills/supabase.md) | [`knowledge/database-conventions.md`](knowledge/database-conventions.md) |
| **Drizzle ORM, schemas, migrations** | [`skills/drizzle.md`](skills/drizzle.md) | [`knowledge/database-conventions.md`](knowledge/database-conventions.md) |
| **Vector search & HNSW indexes** | [`skills/vector-search.md`](skills/vector-search.md) | [`knowledge/database-conventions.md`](knowledge/database-conventions.md) |
| **Embeddings & model dimensions** | [`skills/embeddings.md`](skills/embeddings.md) | [`knowledge/database-conventions.md`](knowledge/database-conventions.md) |
| **Retrieval-Augmented Generation (RAG)** | [`skills/rag.md`](skills/rag.md) | [`knowledge/architecture.md`](knowledge/architecture.md) |
| **Vercel AI SDK, chat, streaming** | [`skills/ai-sdk.md`](skills/ai-sdk.md) | [`knowledge/architecture.md`](knowledge/architecture.md) |
| **AI streaming UI & status indicators** | [`skills/ai-streaming.md`](skills/ai-streaming.md) | [`knowledge/ui-conventions.md`](knowledge/ui-conventions.md) |
| **LangChain loaders, splitters, chains** | [`skills/langchain.md`](skills/langchain.md) | [`knowledge/architecture.md`](knowledge/architecture.md) |
| **LangGraph agent graphs & cycles** | [`skills/langgraph.md`](skills/langgraph.md) | [`knowledge/architecture.md`](knowledge/architecture.md) |
| **Agent architectures & patterns** | [`skills/agents.md`](skills/agents.md) | [`knowledge/architecture.md`](knowledge/architecture.md) |
| **Tool calling standards & Zod schemas** | [`skills/tool-calling.md`](skills/tool-calling.md) | [`knowledge/architecture.md`](knowledge/architecture.md) |
| **Model Context Protocol (MCP)** | [`skills/mcp.md`](skills/mcp.md) | [`knowledge/architecture.md`](knowledge/architecture.md) |
| **Deepgram Speech-to-Text & Text-to-Speech** | [`skills/deepgram.md`](skills/deepgram.md) | [`knowledge/architecture.md`](knowledge/architecture.md) |
| **Document intelligence & PDF parsing** | [`skills/document-intelligence.md`](skills/document-intelligence.md) | [`knowledge/architecture.md`](knowledge/architecture.md) |
| **Multimodal AI (Vision, OCR, Audio)** | [`skills/multimodal-ai.md`](skills/multimodal-ai.md) | [`knowledge/architecture.md`](knowledge/architecture.md) |
| **AI cost control & token budgets** | [`skills/ai-cost.md`](skills/ai-cost.md) | [`knowledge/security-conventions.md`](knowledge/security-conventions.md) |
| **AI observability & LangSmith** | [`skills/ai-observability.md`](skills/ai-observability.md) | [`knowledge/architecture.md`](knowledge/architecture.md) |
| **AI evaluation & golden datasets** | [`skills/ai-evaluation.md`](skills/ai-evaluation.md) | `tests/` |
| **Prompt security & injection defense** | [`skills/prompt-security.md`](skills/prompt-security.md) | [`knowledge/security-conventions.md`](knowledge/security-conventions.md) |
| **Python ML decoupled architecture** | [`skills/python-ml.md`](skills/python-ml.md) | [`knowledge/architecture.md`](knowledge/architecture.md) |
| **FastAPI model serving** | [`skills/model-serving.md`](skills/model-serving.md) | [`knowledge/architecture.md`](knowledge/architecture.md) |
| **Scikit-Learn classical ML** | [`skills/sklearn.md`](skills/sklearn.md) | [`knowledge/architecture.md`](knowledge/architecture.md) |
| **PyTorch deep learning inference** | [`skills/pytorch.md`](skills/pytorch.md) | [`knowledge/architecture.md`](knowledge/architecture.md) |
| **Hugging Face Transformers** | [`skills/transformers.md`](skills/transformers.md) | [`knowledge/architecture.md`](knowledge/architecture.md) |
| **Hugging Face Serverless API** | [`skills/huggingface.md`](skills/huggingface.md) | [`knowledge/architecture.md`](knowledge/architecture.md) |
| **MLflow experiment tracking** | [`skills/mlflow.md`](skills/mlflow.md) | [`knowledge/architecture.md`](knowledge/architecture.md) |
| **Tailwind styling & tokens** | [`skills/tailwind.md`](skills/tailwind.md) | [`knowledge/ui-conventions.md`](knowledge/ui-conventions.md) |
| **shadcn/ui primitives** | [`skills/shadcn.md`](skills/shadcn.md) | [`knowledge/ui-conventions.md`](knowledge/ui-conventions.md) |
| **UI design & micro-interactions** | [`skills/ui-design.md`](skills/ui-design.md) | [`knowledge/ui-conventions.md`](knowledge/ui-conventions.md) |
| **Accessibility & ARIA** | [`skills/accessibility.md`](skills/accessibility.md) | [`knowledge/ui-conventions.md`](knowledge/ui-conventions.md) |
| **Responsive design & mobile** | [`skills/responsive-design.md`](skills/responsive-design.md) | [`knowledge/ui-conventions.md`](knowledge/ui-conventions.md) |
| **Error handling & UI states** | [`skills/error-handling.md`](skills/error-handling.md) | [`knowledge/ui-conventions.md`](knowledge/ui-conventions.md) |
| **Clerk authentication & guards** | [`skills/clerk.md`](skills/clerk.md) | [`knowledge/security-conventions.md`](knowledge/security-conventions.md) |
| **Security & secret hygiene** | [`skills/security.md`](skills/security.md) | [`knowledge/security-conventions.md`](knowledge/security-conventions.md) |
| **API design & Route Handlers** | [`skills/api-design.md`](skills/api-design.md) | [`knowledge/architecture.md`](knowledge/architecture.md) |
| **Database design & indexing** | [`skills/database-design.md`](skills/database-design.md) | [`knowledge/database-conventions.md`](knowledge/database-conventions.md) |
| **Cloudinary uploads & CDN** | [`skills/cloudinary.md`](skills/cloudinary.md) | [`knowledge/environment-variables.md`](knowledge/environment-variables.md) |
| **Biome linting & formatting** | [`skills/biome.md`](skills/biome.md) | `biome.json` |
| **Unit & E2E testing** | [`skills/testing.md`](skills/testing.md) | `tests/` |
| **Vercel deployment & production** | [`skills/vercel.md`](skills/vercel.md) | [`knowledge/deployment-conventions.md`](knowledge/deployment-conventions.md) |
| **Hackathon rapid shipping playbook** | [`skills/hackathon-development.md`](skills/hackathon-development.md) | [`knowledge/hackathon-workflow.md`](knowledge/hackathon-workflow.md) |

---

## 6. Key CLI Commands

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
bun run test:watch    # Run Vitest in watch mode
bun run test:e2e      # Run Playwright E2E tests
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
