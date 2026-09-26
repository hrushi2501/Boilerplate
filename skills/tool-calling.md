# Skill: Tool Calling & Integration

## When to Use

Use this skill when exposing backend capabilities (databases, third-party APIs, search, calculations, Redis caches, Cloudinary assets) to LLMs or agents.

---

## Canonical Tool Definition Standard

All tools must adhere to strict typing, runtime schema validation with **Zod**, and robust error handling.

### 1. Vercel AI SDK Tool Standard

```ts
import { tool } from "ai";
import { z } from "zod";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getPostsByUserTool = tool({
  description: "Fetches recent posts created by a specific user from the database.",
  parameters: z.object({
    userId: z.string().min(1).describe("The user ID to fetch posts for"),
    limit: z.number().int().min(1).max(50).default(10).describe("Maximum number of posts to retrieve"),
  }),
  execute: async ({ userId, limit }) => {
    try {
      const results = await db
        .select()
        .from(posts)
        .where(eq(posts.userId, userId))
        .limit(limit);

      return {
        success: true,
        count: results.length,
        posts: results,
      };
    } catch (error) {
      // Structured error response allowing the LLM to understand and adapt
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to query posts from database.",
      };
    }
  },
});
```

### 2. LangChain / LangGraph Dynamic Structured Tool Standard

```ts
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { redis } from "@/lib/redis";

export const cacheLookupTool = new DynamicStructuredTool({
  name: "cache_lookup",
  description: "Looks up an ephemeral cached value by key.",
  schema: z.object({
    key: z.string().describe("The cache key to check"),
  }),
  func: async ({ key }) => {
    if (!redis) {
      return JSON.stringify({ error: "Cache client is unavailable" });
    }
    const val = await redis.get(key);
    return JSON.stringify({ key, value: val ?? null });
  },
});
```

---

## Tool Calling Engineering Rules

1. **Explicit Schema Descriptions**: Describe every parameter clearly in the Zod schema (`.describe(...)`). Models rely on parameter descriptions to construct correct arguments.
2. **Deterministic Return Values**: Always return JSON-serializable objects. Include a `success: boolean` flag or structured message.
3. **Idempotency & Safe Execution**: Mark destructive or write operations explicitly. Where possible, make writes idempotent using unique keys or deduplication tokens.
4. **Timeouts**: Wrap external HTTP calls with `AbortSignal.timeout(ms)` to avoid hanging agent loops if a third-party service lags.
5. **Authorization Checks**: Validate that the calling user has permission to execute the action on the targeted resource (e.g. check Clerk `auth().userId` matches resource ownership).
6. **Zero Browser Secrets**: All tools that access private keys, APIs, or database connections must execute strictly server-side.
