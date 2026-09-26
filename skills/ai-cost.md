# Skill: AI Cost Control, Token Budgets & Rate Limiting

## When to Use

Use this skill whenever deploying LLMs, multimodal models, vector embeddings, or agent loops to ensure hackathon credit longevity, eliminate bill shock, and maintain fast response times.

---

## 1. The Golden Rule of Agent Termination

> ⚠️ **ABSOLUTE RULE**: **Every autonomous agent loop must have an immutable hard boundary.**
> Never write `while(true)` loops. Always enforce `maxSteps` or `maxIterations`.

```ts
// AI SDK:
const result = await generateText({
  model: openai("gpt-4o-mini"),
  tools,
  maxSteps: 5, // Guaranteed termination after at most 5 tool calls
  prompt,
});

// LangGraph:
function shouldContinue(state: typeof AgentState.State) {
  if (state.iterationCount >= 3 || state.isFinished) {
    return "finalize";
  }
  return "next_tool";
}
```

---

## 2. Model Tiering Matrix (Cost vs. Capability)

| Tier | Models | When to Use | Typical Pricing (Input/Output per 1M tokens) |
| :--- | :--- | :--- | :--- |
| **Tier 1 (Fast / Cheap)** | `gemini-2.0-flash`, `gpt-4o-mini`, `llama-3.3-70b` | Chat, classification, routing, summarizing, simple extraction | ~$0.10 - $0.60 |
| **Tier 2 (Reasoning / Complex)** | `gpt-4o`, `claude-3-5-sonnet`, `gemini-2.0-pro` | Code synthesis, complex multi-step reasoning, nuanced evaluation | ~$2.50 - $15.00 |

> **Strategy**: Default to **Tier 1**. Only escalate to Tier 2 when prompt engineering on Tier 1 demonstrably fails the task.

---

## 3. Caching Strategies

### Response Caching (Upstash Redis)

For deterministic prompts (e.g. FAQ questions, entity extraction, static document analysis):

```ts
import { redis } from "@/lib/redis";
import crypto from "crypto";

export async function getCachedLLMResponse(cacheKeyRaw: string, generateFn: () => Promise<string>): Promise<string> {
  if (!redis) return await generateFn();

  const hash = crypto.createHash("sha256").update(cacheKeyRaw).digest("hex");
  const key = `llm_cache:${hash}`;

  const cached = await redis.get<string>(key);
  if (cached) return cached;

  const fresh = await generateFn();
  await redis.set(key, fresh, { ex: 60 * 60 * 24 }); // Cache 24 hours
  return fresh;
}
```

---

## 4. Prompt Compression & Context Pruning

1. **System Prompt Leanliness**: Keep system instructions under 300 words. Use bullet points and precise rules.
2. **Context Window Hygiene**: In multi-turn chat, prune historical messages. Keep only the last 6-10 conversation turns, or summarize older conversation history into a single compact memory paragraph.
3. **Retrieval Pruning (RAG)**: Do not stuff 20 chunks into context. Retrieve top 3-5 high-confidence chunks (`similarity > 0.70`).
4. **Enforce `maxTokens`**: Always pass `maxTokens: 500` (or appropriate ceiling) on every text generation call to prevent runaway verbosity.
