# Skill: Agents & Agentic Workflows

## When to Use

Use when implementing autonomous agent workflows, tool calling, multi-step reasoning loops, or coding agent coordination.

## Important Conventions

- **Canonical Agent Guide**: Always consult `AGENTS.md` at repository root as the canonical instruction set.
- **Hierarchy of Truth**:
  1. `AGENTS.md` (canonical principles and commands)
  2. `skills/` (actionable domain knowledge)
  3. `knowledge/` (durable project decisions and conventions)
- **Focused Execution**: Prefer small, modular tools that do one thing well with strictly typed Zod schemas.
- **Error Handling**: Return structured errors from tools so agent loops can self-correct without crashing.

## Things to Avoid

- Do NOT create unbounded, infinitely looping agent chains without max step bounds.
- Do NOT let agents execute non-deterministic, destructive operations without confirmation or sandbox protection.
- Do NOT ignore established project conventions when executing agentic refactors.
