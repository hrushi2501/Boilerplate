import { Redis } from "@upstash/redis";

/**
 * Upstash Redis Server-side Client (REST)
 *
 * Designed for serverless environments (Next.js / Vercel Edge & Node runtimes).
 * Credentials must remain strictly server-side.
 *
 * Use cases:
 * - Caching expensive database/API queries
 * - Rate limiting & request throttling
 * - Ephemeral state, short-lived coordination, and locks
 * - Lightweight counters & deduplication
 *
 * Note: Supabase PostgreSQL is the primary persistent source of truth.
 * Do not store permanent relational data here.
 */

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis =
  redisUrl && redisToken
    ? new Redis({
        url: redisUrl,
        token: redisToken,
      })
    : null;

/**
 * Returns the Redis client or throws a descriptive error if environment variables are missing.
 */
export function getRedis(): Redis {
  if (!redis) {
    throw new Error(
      "Upstash Redis is not configured. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env.local",
    );
  }
  return redis;
}
