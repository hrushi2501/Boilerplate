# Skill: Vector Search with Supabase pgvector

## When to Use

Use vector search when you need:

- Semantic search (understanding search intent rather than exact keyword matches)
- Similarity matching (recommendations, duplicate detection, content clustering)
- Knowledge retrieval for RAG pipelines

> **Rule**: Do NOT create vector embeddings for every database table by default. Use standard B-Tree indexes and SQL `ILIKE` / Full-Text Search unless semantic matching is genuinely needed.

---

## Vector Indexes & Performance

Supabase `pgvector` provides two primary index types:

### 1. HNSW (Hierarchical Navigable Small World) — Recommended

- **Best for**: Fast queries, high recall, low latency.
- **Index build time**: Slightly longer build time, uses more memory.
- **When to use**: Almost always preferred for hackathon and production apps with up to millions of vectors.

```sql
-- Create HNSW index for cosine distance
create index on document_sections using hnsw (embedding vector_cosine_ops);
```

### 2. IVFFlat (Inverted File Flat)

- **Best for**: Memory-constrained environments.
- **Requires**: Building after data is already inserted (`lists` parameter tuning).

---

## Similarity Metrics

| Metric | Operator | Best Suited For |
| :--- | :--- | :--- |
| **Cosine Distance** | `<=>` | Normalized embeddings (text-embedding-3-small, Gemini embeddings) |
| **L2 Distance (Euclidean)** | `<->` | Unnormalized geometric vectors, spatial distances |
| **Inner Product (Dot Product)** | `<#>` | Normalized unit vectors when maximizing calculation speed |

Always ensure your query operator matches the metric your embedding model was trained for (Cosine `<=>` is standard for modern LLM embeddings).

---

## Hybrid Search (Vectors + Full-Text Search)

Combine semantic similarity with keyword precision using Postgres Full-Text Search:

```sql
create or replace function hybrid_search (
  query_text text,
  query_embedding vector(1536),
  match_count int,
  full_text_weight float default 1.0,
  semantic_weight float default 1.0
)
returns table (
  id uuid,
  content text,
  score float
)
language plpgsql
as $$
begin
  return query
  select
    id,
    content,
    (
      full_text_weight * ts_rank_cd(to_tsvector('english', content), plainto_tsquery('english', query_text)) +
      semantic_weight * (1 - (embedding <=> query_embedding))
    ) as score
  from document_sections
  order by score desc
  limit match_count;
end;
$$;
```

---

## Operational Checklist

- [ ] Extension enabled: `create extension if not exists vector;`
- [ ] Embedding column dimensions strictly match the model output (e.g. `vector(1536)` for `text-embedding-3-small`, `vector(768)` for `text-embedding-004`).
- [ ] Appropriate index created (`hnsw` with `vector_cosine_ops`).
- [ ] Metadata filters indexed (e.g. `user_id` or `workspace_id` indexed for fast tenancy partition).
- [ ] Minimum similarity threshold applied (reject results with cosine score `< 0.65`).
