# Skill: Biome

## When to Use

Use for linting, formatting, code quality verification, and import organization across all TypeScript, JavaScript, and CSS files.

## Important Conventions

- **Canonical Linter/Formatter**: Biome replaces both ESLint and Prettier in this repository.
- **Config**: Defined in `biome.json`.
- **Indentation**: 2 spaces, standard double quotes / semicolons according to config.
- **Git VCS Integration**: Enabled with `useIgnoreFile: true`.

## Things to Avoid

- Do NOT install or run ESLint or Prettier.
- Do NOT commit unformatted or lint-failing code.
- Do NOT bypass Biome checks without fixing underlying code issues.

## Relevant Commands

```bash
bun run check        # Check code formatting, lint rules, and imports
bun run format       # Format code in-place
bun run lint         # Run Biome linter
bunx @biomejs/biome check --write   # Automatically apply safe fixes and sort imports
```
