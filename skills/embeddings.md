# Skill: Embeddings Management

## When to Use

Use this skill when converting text, code, or multimodal assets into numerical vector representations for similarity search, clustering, or RAG.

---

## Canonical Models & Dimensions

| Provider | Model | Dimensions | Strengths | Cost (Approx) |
| :--- | :--- | :--- | :--- | :--- |
| **OpenAI** | `text-embedding-3-small` | 1536 (or flexible down to 512) | Great general balance, high speed | ~$0.02 / 1M tokens |
| **OpenAI** | `text-embedding-3-large` | 3072 (or flexible down to 1536) | SOTA accuracy for complex retrieval | ~$0.13 / 1M tokens |
| **Google** | `text-embedding-004` | 768 | Fast, high quality, generous free tier | ~$0.00 / free tier |
| **Hugging Face** | `BAAI/bge-small-en-v1.5` | 384 | Ultra-lightweight for local or edge | Open source |

---

## The Golden Rule of Embeddings

> ⚠️ **NEVER mix embeddings from different models (or different dimensionalities) in the same vector column or index.**
> Cosine distance between vectors from different models is mathematically meaningless.

If you ever change models or dimensions:

1. Create a new vector column (e.g. `embedding_v2 vector(768)`) or migration table.
2. Backfill embeddings asynchronously using Upstash QStash.
3. Switch query runtime to the new column once backfilled.

---

## Generation & Caching Pattern

Avoid recomputing expensive embeddings for identical text passages:

```ts
import { openai } from "@ai-sdk/openai";
import { embed, embedMany } from "ai";
import { redis } from "@/lib/redis";
import crypto from "crypto";

export async function getCachedEmbedding(text: string): Promise<number[]> {
  const hash = crypto.createHash("sha256").update(text.trim()).digest("hex");
  const cacheKey = `embed:v1:${hash}`;

  // 1. Check Redis cache
  if (redis) {
    const cached = await redis.get<number[]>(cacheKey);
    if (cached) return cached;
  }

  // 2. Generate with AI SDK
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: text,
  });

  // 3. Cache for 7 days
  if (redis) {
    await redis.set(cacheKey, embedding, { ex: 60 * 60 * 24 * 7 });
  }

  return embedding;
}

// Batching utility for bulk ingestion
export async function batchEmbed(texts: string[]): Promise<number[][]> {
  const { embeddings } = await embedMany({
    model: openai.embedding("text-embedding-3-small"),
    values: texts,
  });
  return embeddings;
}
```

---

## Best Practices

1. **Batch Ingestion**: Always use `embedMany` when indexing documents. Generating vectors one-by-one introduces high network latency overhead.
2. **Normalize Input Text**: Strip excessive whitespace, markdown artifacts, or binary junk before embedding to maximize token efficiency.
3. **Truncation Guard**: Check token length before embedding to prevent model context boundary truncation errors.
