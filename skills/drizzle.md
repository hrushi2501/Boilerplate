# Skill: Drizzle ORM

## When to Use

Use when defining PostgreSQL tables, writing database queries, managing migrations, or seeding data.

## Important Conventions

- **Schema Location**: Define all tables in `src/db/schema.ts` (or submodules exported through `src/db/schema.ts`).
- **Client Export**: Access the database instance via `import { db } from "@/db"`.
- **Config**: Configured in `drizzle.config.ts` targeting dialect `"postgresql"`.
- **Connection Optimization**: Server connection uses `prepare: false` in `src/db/index.ts` to support Supabase connection pooling (port 6543 / Supavisor).
- **Type Safety**: Derive TypeScript types using `typeof <tableName>.$inferSelect` and `typeof <tableName>.$inferInsert`.

## Things to Avoid

- Do NOT run manual string-interpolated SQL (`sql"..."` with raw unescaped values); always use parameterized helpers.
- Do NOT create fake or bloated application tables before actual product requirements are established.
- Do NOT commit migrations that have not been tested against local or test databases.

## Relevant Commands

```bash
bun run db:generate   # Generate migration files from schema
bun run db:migrate    # Apply pending migrations to the database
bun run db:push       # Push schema changes directly to DB (fast during hackathons)
bun run db:studio     # Launch local Drizzle Studio to inspect DB rows
```
