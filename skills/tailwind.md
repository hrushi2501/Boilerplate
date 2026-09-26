# Skill: Tailwind CSS

## When to Use

Use when styling components, page layouts, grids, flex containers, or animations.

## Important Conventions

- **Tailwind v4 Configuration**: Configured via `@import "tailwindcss";` in `src/app/globals.css`.
- **Theme Variables**: Use semantic color variables (`bg-background`, `text-foreground`, `bg-card`, `border-border`, `text-muted-foreground`, `bg-primary`, `text-primary-foreground`).
- **Dark Mode**: Supports class-based dark mode (`.dark`), seamlessly compatible with `next-themes`.
- **Utility Merging**: Always use `cn(...)` from `@/lib/utils` when combining conditional classes.

## Things to Avoid

- Do NOT hardcode arbitrary colors (e.g., `#1e293b`) when semantic theme tokens (`bg-muted`, `border-border`) are available.
- Do NOT write custom CSS outside `globals.css` unless strictly necessary.
- Avoid cluttered inline style tags (`style={{ ... }}`).

## Relevant Standards

- Keep responsive variants clean (`sm:`, `md:`, `lg:`).
- Use Tailwind layout primitives (`flex`, `grid`, `gap-4`).
