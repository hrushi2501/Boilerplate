# Database Conventions

## Data Layer Responsibilities

| System | Role | Primary Use Cases |
| :--- | :--- | :--- |
| **Supabase PostgreSQL** | **Source of Truth** (Persistent) | Relational application data, user records, transactional state, business entities, durable storage. |
| **Upstash Redis** | **Ephemeral Layer** (Cache/Fast) | In-memory caching, rate-limit windows, transient session tokens, real-time counters, distributed locks, deduplication. |

> **Crucial Rule**: Do NOT duplicate permanent PostgreSQL entities into Redis unless there is an explicit caching requirement with a TTL. Redis is ephemeral; PostgreSQL is persistent.

---

## Supabase PostgreSQL + Drizzle ORM

### Connection Architecture

In `src/db/index.ts`:

- Connection pooling is handled by `postgres` driver.
- `prepare: false` is configured to ensure compatibility with Supabase's transaction pooler (port 6543 / Supavisor).
- In development, the client connection is attached to `globalThis` to prevent connection exhaustion during Next.js hot module reloading.

### Adding New Schemas

Define tables inside `src/db/schema.ts`:

```ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(), // Clerk User ID
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
```

### Migration Workflow

1. **Direct Push (Rapid prototyping / Hackathons)**:

   ```bash
   bun run db:push
   ```

2. **Standard Migration Generation & Application**:

   ```bash
   bun run db:generate   # Generates SQL in ./drizzle
   bun run db:migrate    # Applies migration to remote DB
   ```

3. **Inspecting Data**:

   ```bash
   bun run db:studio     # Opens local Drizzle Studio UI
   ```

---

## Pagination & Query Conventions

### Server-Side Pagination (Default for Large Datasets)

When handling datasets larger than 100 records, never return the full dataset to the client:

```ts
import { db } from "@/db";
import { projects } from "@/db/schema";
import { count, eq } from "drizzle-orm";

export async function getProjectsPaginated(page = 1, pageSize = 20, userId: string) {
  const offset = (page - 1) * pageSize;

  const [totalResult, rows] = await Promise.all([
    db.select({ total: count() }).from(projects).where(eq(projects.userId, userId)),
    db.select().from(projects).where(eq(projects.userId, userId)).limit(pageSize).offset(offset),
  ]);

  return {
    rows,
    totalCount: totalResult[0]?.total ?? 0,
    pageCount: Math.ceil((totalResult[0]?.total ?? 0) / pageSize),
  };
}
```

### Client-Side Table Feature Threshold

- Datasets **< 100 rows**: Safe to fetch entirely with TanStack Query and paginate/filter client-side in TanStack Table.
- Datasets **> 100 rows**: Must delegate pagination, sorting, and search filtering to SQL queries via Drizzle.
