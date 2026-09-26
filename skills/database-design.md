# Skill: Database Design

## When to Use

Use when architecting database schemas, adding tables, establishing foreign keys, or creating database indexes.

## Important Conventions

- **Schema Location**: Add schemas in `src/db/schema.ts` (using `pgTable` from `drizzle-orm/pg-core`).
- **Primary Keys**: Use UUID primary keys (`id: uuid("id").defaultRandom().primaryKey()`) or auto-incrementing serials (`serial("id").primaryKey()`).
- **Timestamps**: Always include `createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()` and optional `updatedAt`.
- **Clerk Integration**: Store user ownership via `userId: text("user_id").notNull()`, indexing on `userId` for quick user queries.
- **Foreign Keys**: Define explicit foreign key constraints (`.references(() => otherTable.id, { onDelete: "cascade" })`).

## Things to Avoid

- Do NOT create premature, deeply nested, multi-table relationship graphs before product requirements demand them.
- Do NOT forget indexes on frequently filtered foreign keys or user ID columns.
- Do NOT use non-timezone-aware timestamps for audit columns.

## Relevant Commands

```bash
bun run db:generate   # Generate migration SQL
bun run db:migrate    # Apply migration to Supabase DB
bun run db:push       # Push schema directly in rapid prototyping
```
