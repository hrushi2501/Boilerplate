# Skill: Security Architecture & Hardening

## When to Use

Use this skill whenever handling secrets, user authentication, authorization policies, database queries, file uploads, tool executions, background webhooks, or AI model integrations.

---

## 1. Zero Secrets in Client Bundles (Absolute Rule)

> ⚠️ **CRITICAL RULE**: Private keys, database connection strings, and backend secrets must NEVER appear in client components, browser JavaScript bundles, or Git commits.

### Secret Classification Matrix

| Environment Variable | Scope | Safe in Client Bundle? |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Public client | ✅ Yes |
| `CLERK_SECRET_KEY` | Server only | ❌ NO |
| `NEXT_PUBLIC_SUPABASE_URL`, `ANON_KEY` | Public client (enforces RLS) | ✅ Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only (bypasses RLS) | ❌ NO |
| `DATABASE_URL`, `DIRECT_URL` | Server only | ❌ NO |
| `UPSTASH_REDIS_REST_TOKEN` | Server only | ❌ NO |
| `QSTASH_TOKEN`, signing keys | Server only | ❌ NO |
| `OPENAI_API_KEY`, AI provider keys | Server only | ❌ NO |
| `DEEPGRAM_API_KEY` | Server only | ❌ NO |
| `CLOUDINARY_API_SECRET` | Server only | ❌ NO |

---

## 2. Authentication & Authorization Guards

Every protected API route, Server Action, and page must explicitly verify identity and ownership:

```ts
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function deletePostAction(postId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Enforce tenant ownership: user can ONLY delete their own record
  const result = await db
    .delete(posts)
    .where(and(eq(posts.id, postId), eq(posts.userId, userId)))
    .returning();

  if (result.length === 0) {
    throw new Error("Forbidden or post not found");
  }

  return { success: true };
}
```

---

## 3. Tool Authorization & SSRF Prevention

When agents or users supply URLs or dynamic queries:

1. **SSRF (Server-Side Request Forgery)**: Never allow tools to make arbitrary HTTP requests to internal IP ranges (`127.0.0.1`, `169.254.169.254`, `10.0.0.0/8`, `192.168.0.0/16`).
2. **Strict Tool Whitelisting**: Only expose tools the specific user role is permitted to run.
3. **No Dynamic SQL Execution**: Never pass raw user or LLM strings into `db.execute()`. Always use Drizzle parameterized expressions.

---

## 4. Webhook & Background Job Verification

All webhook endpoints (Clerk webhooks, Upstash QStash, Stripe) must cryptographically verify signatures:

- **QStash**: Always run `verifyQStashSignature(req, rawBody)` using `src/lib/qstash.ts`.
- **Clerk Webhooks**: Verify with `svix` headers before processing user creation/deletion events.

---

## 5. File Upload & Malicious Document Hygiene

When accepting user files:

1. Validate MIME type AND file extension against a strict allowlist.
2. Enforce file size caps (e.g. max 10MB).
3. Deliver public media through Cloudinary CDN with automatic malware/type inspection.
4. Treat parsed document content as untrusted input.
