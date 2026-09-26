# Skill: Vercel Deployment

## When to Use

Use when configuring deployment parameters, inspecting edge/serverless runtime behavior, or managing environment variables for production.

## Important Conventions

- **Zero Config**: Standard Next.js builds work seamlessly on Vercel out of the box.
- **Environment Variables**: Configure all variables documented in `.env.example` in the Vercel Project Dashboard (Settings -> Environment Variables).
- **Build Command**: `bun run build` or Next default `next build`.
- **Install Command**: `bun install`.
- **Framework Preset**: Next.js.

## Things to Avoid

- Do NOT commit `.env.local` or `.vercel` directory to git.
- Do NOT use Node.js-only native binaries that are incompatible with serverless environments.
- Do NOT leave unvalidated environment variables that can cause production runtime crashes.

## Relevant Commands

```bash
bun run build         # Validate local build passes before pushing to Vercel
```
