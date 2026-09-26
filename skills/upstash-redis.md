# Skill: Upstash Redis

## When to Use

Use Upstash Redis as an optional, fast/ephemeral data layer for:

- **Caching**: Storing expensive database queries or third-party API results with TTL (`redis.set(key, val, { ex: 60 })`).
- **Rate Limiting**: Request throttling on API routes or Server Actions.
- **Temporary State**: Storing transient validation tokens, OTPs, or multi-step wizard state.
- **Deduplication**: Checking whether a webhook or job has already been processed (`SET NX`).
- **Lightweight Counters**: Real-time view counts, click tracking, or quota tracking (`redis.incr(key)`).
- **Temporary Job / State Coordination**: Distributed locks and ephemeral coordination between serverless functions.

## Upstash vs. Supabase Data Responsibilities

| System | Responsibility |
| :--- | :--- |
| **Supabase PostgreSQL** | **Primary Source of Truth**: Persistent relational records, users, transactions, business entities, durable application state. |
| **Upstash Redis** | **Ephemeral & Cache Layer**: Temporary cache, rate-limit windows, counters, short-lived locks, performance optimization. |

> **Rule**: Do NOT store data in Redis that belongs permanently in PostgreSQL. Do NOT duplicate relational records into Redis unless there is a concrete caching justification with a defined TTL.

## Important Conventions

- **Server-Side Only**: Access Redis through `@/lib/redis` via `redis` or `getRedis()`.
- **REST Client**: Uses `@upstash/redis` REST client optimized for Vercel and Next.js serverless runtimes (stateless HTTP requests, zero persistent TCP connection overhead).
- **Graceful Degradation**: Always handle cache misses and fall back to the primary database (Supabase PostgreSQL).

## Things to Avoid

- Do NOT expose `UPSTASH_REDIS_REST_URL` or `UPSTASH_REDIS_REST_TOKEN` to client components.
- Do NOT use Redis as the primary database for persistent entities.
- Do NOT create fake or demo counters; keep the utility minimal and application-ready.

## Usage Example

```ts
import { redis } from "@/lib/redis";

export async function getCachedData(key: string) {
  if (!redis) return null; // Fall back cleanly if Redis is not configured
  return await redis.get(key);
}
```
