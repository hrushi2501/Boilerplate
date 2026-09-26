# CODEX.md — Canonical AI Agent Instructions for Codex

@AGENTS.md

> **Notice for OpenAI Codex & External AI Agents**:
> All agents operating in this repository must strictly adhere to [`AGENTS.md`](./AGENTS.md).
>
> 1. **Authority**: `AGENTS.md` is the single canonical source of truth. There are no competing conventions.
> 2. **Hierarchy**: Follow `AGENTS.md` → `skills/` → `knowledge/` → Implementation. Read the relevant skill file before modifying code.
> 3. **Frozen Stack**: Bun, Next.js App Router, Biome, Supabase PostgreSQL, Drizzle ORM, Clerk, TanStack Query/Table, Upstash Redis/QStash, Deepgram, Tailwind CSS v4, shadcn/ui.
> 4. **No Gratuitous Dependencies**: Do not install packages without verifying necessity. Never install Python packages into Next.js.
> 5. **Validation Cycle**: Always verify your changes with:
>
>    ```bash
>    bun run check && bun run typecheck && bun run test
>    ```
