# Skill: Retrieval-Augmented Generation (RAG)

## When to Use

Use RAG when your application needs to answer queries based on private documents, knowledge bases, manuals, user uploads, or domain-specific corpora.

---

## Canonical Stack Decision

- **Vector Database**: **Supabase PostgreSQL with `pgvector`** extension.
- **Do NOT** add Pinecone, Weaviate, Qdrant, Milvus, or Chroma by default. Supabase pgvector handles vectors alongside your relational user and tenancy tables with zero extra infrastructure.

---

## The Standard RAG Pipeline

```text
 ┌──────────┐     ┌───────────┐     ┌──────────┐     ┌──────────┐     ┌──────────────┐
 │ Document │ ──► │ Clean &   │ ──► │ Metadata │ ──► │ Generate │ ──► │ Store in     │
 │ (PDF/MD) │     │ Chunk     │     │ Tagging  │     │ Vector   │     │ Supabase DB  │
 └──────────┘     └───────────┘     └──────────┘     └──────────┘     └──────────────┘
                                                                             │
 ┌──────────┐     ┌───────────┐     ┌──────────┐     ┌──────────┐            ▼
 │ Response │ ◄── │ LLM       │ ◄── │ Assemble │ ◄── │ Rerank / │ ◄── Cosine Sim     │
 │ + Source │     │ Synthesis │     │ Context  │     │ Filter   │     Hybrid Query   │
 └──────────┘     └───────────┘     └──────────┘     └──────────┘     └──────────────┘
```

---

## Implementation Guide

### 1. Document Chunking & Metadata

Chunk documents cleanly with reasonable overlap:

- Optimal chunk size: `500 - 1000` tokens
- Chunk overlap: `100 - 200` tokens
- Metadata schema:
  - `documentId`: Source document ID
  - `userId`: Tenant isolation key
  - `pageNumber`: For citation accuracy
  - `category` / `tags`: For metadata pre-filtering

### 2. Similarity Search Query (SQL / RPC)

In Supabase SQL:

```sql
create extension if not exists vector;

create table if not exists document_sections (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null,
  user_id text not null,
  content text not null,
  metadata jsonb,
  embedding vector(1536), -- Match your embedding model dimensions
  created_at timestamp with time zone default now()
);

-- Cosine distance similarity match function
create or replace function match_document_sections (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  filter_user_id text
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    ds.id,
    ds.content,
    ds.metadata,
    1 - (ds.embedding <=> query_embedding) as similarity
  from document_sections ds
  where ds.user_id = filter_user_id
    and 1 - (ds.embedding <=> query_embedding) > match_threshold
  order by ds.embedding <=> query_embedding
  limit match_count;
end;
$$;
```

### 3. TypeScript Query Helper

```ts
import { supabaseAdmin } from "@/lib/supabase/server";

export async function retrieveContext(queryEmbedding: number[], userId: string) {
  const { data, error } = await supabaseAdmin.rpc("match_document_sections", {
    query_embedding: queryEmbedding,
    match_threshold: 0.70,
    match_count: 5,
    filter_user_id: userId,
  });

  if (error) {
    console.error("Vector search failed:", error);
    return [];
  }

  return data as Array<{ id: string; content: string; metadata: Record<string, unknown>; similarity: number }>;
}
```

### 4. Hallucination Mitigation & Citations

1. **System Prompt Constraint**:

   ```text
   Answer the question strictly using the provided context passages. If the context does not contain the answer, explicitly state: "The provided documents do not contain sufficient information to answer this question." Do not fabricate facts.
   ```

2. **Mandatory Citations**:
   Instruct the model to cite passage numbers or document titles (e.g. `[Doc 1, p. 4]`).
3. **Similarity Threshold**:
   Filter out any chunks below threshold (e.g. `similarity < 0.65`) before passing to prompt context.
