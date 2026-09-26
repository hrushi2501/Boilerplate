# Skill: shadcn/ui

## When to Use

Use when adding or customizing UI components (Buttons, Cards, Dialogs, Inputs, Sheets, Avatars, etc.).

## Important Conventions

- **Component Location**: Components live in `src/components/ui/`.
- **Config**: Defined in `components.json` with style presets.
- **Import Aliases**: Import UI components from `@/components/ui/<component>`.
- **Polymorphism**: In this configuration, components use the modern `render` prop (e.g. `render={<Link href="..." />}`) or direct styling with `buttonVariants({ size: "sm" })`.

## Things to Avoid

- Do NOT re-implement standard primitives (like modals or dropdowns) from scratch when shadcn provides accessible base components.
- Do NOT install components with wrong import paths (always check `from "@/lib/utils"` for `cn`).

## Relevant Commands

```bash
bunx --bun shadcn@latest add <component-name> -y   # Add new shadcn component
```
