# Skill: Upstash QStash (Serverless Background Jobs)

## When to Use

Use **Upstash QStash** (`@upstash/qstash`, `src/lib/qstash.ts`) when:

- Executing long-running AI tasks, complex multi-step LangGraph agents, or bulk document embeddings that exceed Vercel's standard HTTP function timeout limits (10s on Hobby, 60s on Pro).
- Scheduling recurring cron tasks or delaying jobs by seconds/minutes/hours.
- Triggering background jobs with automatic exponential backoff retries and dead-letter queues.
- Building event-driven architectures where the user receives an instant HTTP 202 response while work continues asynchronously.

> **Rule**: Do NOT use QStash for fast, ordinary synchronous requests that can return directly in under 2 seconds.

---

## Canonical Asynchronous Workflow

```text
 User Request
      │
      ▼
 [ Next.js API Route ]  ──► Returns 202 Accepted immediately
      │
      ▼ (Dispatches job via QStash REST API)
 [ Upstash QStash Queue ]
      │ (Delivers webhook to Next.js background endpoint with signature)
      ▼
 [ Next.js /api/jobs/agent-worker ] (Verifies signature)
      │
      ▼
 [ LangGraph Agent / Heavy ML / Document Processing ]
      │
      ▼
 [ Writes result to Supabase PostgreSQL & updates job status ]
      │
      ▼
 [ User UI polls or receives TanStack Query update ]
```

---

## Dispatching a Background Job

```ts
import { getQStash } from "@/lib/qstash";

export async function dispatchAgentWorkflow(userId: string, taskPayload: Record<string, unknown>) {
  const qstash = getQStash();

  const destinationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/jobs/execute-agent`;

  const response = await qstash.publishJSON({
    url: destinationUrl,
    body: {
      userId,
      taskPayload,
    },
    retries: 3, // Auto-retry up to 3 times on failure
    delay: 0,   // Delay in seconds (e.g. 60 for 1 minute later)
    headers: {
      "Content-Type": "application/json",
    },
  });

  return { messageId: response.messageId };
}
```

---

## Receiving & Securing the Worker Endpoint

Always verify the QStash signature to prevent spoofing or unauthorized calls to background worker routes:

```ts
// src/app/api/jobs/execute-agent/route.ts
import { verifyQStashSignature } from "@/lib/qstash";
import { db } from "@/db";

export async function POST(req: Request) {
  const rawBody = await req.text();

  // 1. Verify QStash cryptographic signature
  const isValid = await verifyQStashSignature(req, rawBody);
  if (!isValid) {
    return new Response("Invalid signature", { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const { userId, taskPayload } = payload;

  try {
    // 2. Execute long-running agent or heavy AI workflow here
    // e.g., await runLangGraphWorkflow(userId, taskPayload);

    return new Response(JSON.stringify({ status: "completed" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Worker processing failed:", error);
    // Returning 500 signals QStash to retry according to policy
    return new Response("Internal Server Error", { status: 500 });
  }
}
```

---

## Key Best Practices

1. **Idempotency**: Use deterministic job IDs or database state checks (`status: "pending" | "processing" | "completed"`) so retrying a job does not duplicate side effects.
2. **Signature Keys**: Set `QSTASH_CURRENT_SIGNING_KEY` and `QSTASH_NEXT_SIGNING_KEY` in production to allow seamless zero-downtime key rotation.
3. **Status Polling**: Keep track of job progress in Supabase (`jobs` table) so the frontend can query job status with TanStack Query.
