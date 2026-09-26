# Skill: React

## When to Use

Use when creating UI components, hooks, state management, or forms.

## Important Conventions

- **React 19 Compatibility**: Follow React 19 standards (e.g., standard action hooks, modern ref passing, no legacy lifecycles).
- **Form Handling**: Use `react-hook-form` paired with `@hookform/resolvers/zod` and `zod` schemas.
- **Client Components**: Mark only files with interactive hooks (`useState`, `useEffect`, event listeners) with `"use client"`.
- **Query Management**: Use `@tanstack/react-query` for client-side asynchronous caching and background fetching where needed.

## Things to Avoid

- Do NOT introduce complex external global state libraries (like Redux) when URL search params, React state, or React Query suffice for hackathon velocity.
- Do NOT cause hydration mismatches by rendering browser-only state on initial SSR.
- Do NOT perform side effects inside render functions.

## Relevant Commands

```bash
bun run check        # Run Biome lint & format check
bun run test         # Run unit tests with Vitest
```
