# Skill: TypeScript

## When to Use

Use whenever writing or modifying code in this codebase.

## Important Conventions

- **Strict Mode Enabled**: Adhere to `"strict": true` configured in `tsconfig.json`.
- **Path Aliases**: Always use `@/*` to import from `src/*` (e.g., `@/components/ui/button`, `@/lib/utils`, `@/db`).
- **Explicit Types for Public APIs**: Explicitly type function parameters, return types for server actions, and schema inferences.
- **Drizzle Inference**: Use `$inferSelect` and `$inferInsert` for database types.
- **Zod Inference**: Use `z.infer<typeof schema>` for form data and API validation.

## Things to Avoid

- Do NOT use `any` or `@ts-ignore` to silence type errors.
- Do NOT use relative path traversals like `../../../../components` when `@/` is available.
- Do NOT create loose enum definitions; prefer TypeScript const objects or union types (`type Status = "idle" | "loading" | "success"`).

## Relevant Commands

```bash
bun run typecheck     # Run tsc --noEmit to check all types
```
