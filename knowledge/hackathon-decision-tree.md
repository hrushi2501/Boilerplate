# Hackathon Decision Tree

The goal of this decision tree is to eliminate architectural debates and indecision during a hackathon. When a requirement appears, immediately map it to the canonical solution:

---

## 1. Feature-to-Technology Mapping

```text
Requirement                               Canonical Solution                          Reference Skill / Knowledge
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────
User Authentication & Session Security  ──► Clerk (@clerk/nextjs)                     skills/clerk.md
Persistent Relational Data & Models     ──► Supabase PostgreSQL + Drizzle ORM         skills/drizzle.md
Fast Ephemeral Cache / Rate Limiting    ──► Upstash Redis (@upstash/redis)            skills/upstash-redis.md
Background Jobs / Delayed Crons         ──► Upstash QStash (@upstash/qstash)          skills/qstash.md
Server-Side State Synchronization       ──► TanStack Query (@tanstack/react-query)    skills/tanstack-query.md
Complex Data Grids / Filtering / Sort   ──► TanStack Table (@tanstack/react-table)    skills/tanstack-table.md
Media Storage, CDN & Image Transforms   ──► Cloudinary (next-cloudinary)              skills/cloudinary.md
Speech-to-Text & Text-to-Speech         ──► Deepgram (Nova-2/Nova-3, Aura)            skills/deepgram.md
Simple AI Chat / Streaming / JSON       ──► Vercel AI SDK (ai)                        skills/ai-sdk.md
Knowledge Base / RAG Q&A                ──► Supabase pgvector + Embeddings            skills/rag.md
Multi-Step Branching Agent Workflow     ──► LangGraph (StateGraph)                    skills/langgraph.md
Document Loaders & Text Splitters       ──► LangChain (@langchain/core)               skills/langchain.md
External Tool Calling                   ──► Zod-validated Tools / MCP                 skills/tool-calling.md, skills/mcp.md
Long-Running Asynchronous Agent Tasks   ──► LangGraph + Upstash QStash                skills/qstash.md
Document Ingestion (PDF/DOCX/Images)    ──► Multimodal Vision / unpdf                 skills/document-intelligence.md
Classical Tabular ML (Classification)   ──► Decoupled Python FastAPI + Scikit-Learn   skills/python-ml.md, skills/sklearn.md
Deep Learning / Custom Neural Nets      ──► Decoupled Python FastAPI + PyTorch        skills/pytorch.md
Pretrained Open-Source Models           ──► Hugging Face Serverless Inference API     skills/huggingface.md
ML Experiment Tracking & Metrics        ──► MLflow (mlflow)                           skills/mlflow.md
Frontend Hosting & Deployment           ──► Vercel                                    skills/vercel.md
Python ML Service Deployment            ──► Separate Cloud Run / Railway / VPS        skills/model-serving.md
```

---

## 2. AI Complexity Progression (The 5 Levels)

Never start at Level 5 when Level 1 solves the problem.

```text
Level 1: Simple AI
  ├── Chatbots, single completions, streaming text, typed JSON extraction
  └── Technology: Vercel AI SDK (ai)

Level 2: Grounded AI / RAG
  ├── Answering queries using internal documentation, PDFs, or private datasets
  └── Technology: Supabase pgvector + text-embedding-3-small + AI SDK

Level 3: Agentic AI
  ├── Multi-step reasoning, tool execution, iterative evaluation
  └── Technology: LangGraph (StateGraph) + Zod Tools

Level 4: Long-Running & Durable Agents
  ├── Workflows lasting > 15 seconds, retries, webhook dispatching
  └── Technology: LangGraph + Upstash QStash + Supabase status table

Level 5: Multi-Agent Systems
  ├── Supervisor coordinating specialized worker subgraphs
  └── Technology: LangGraph hierarchical graphs
```

---

## 3. What NOT to Do (Anti-Patterns)

- ❌ **Do NOT install Pinecone, Weaviate, or Qdrant.** Supabase pgvector is built-in and co-located with your user tables.
- ❌ **Do NOT use LangGraph for a simple chatbot.** Use Vercel AI SDK `useChat`.
- ❌ **Do NOT install PyTorch into the Next.js runtime.** Python ML belongs in `ml/` served via FastAPI over HTTP.
- ❌ **Do NOT build custom JWT or session logic.** Use Clerk `auth()`.
- ❌ **Do NOT use Prisma.** Drizzle is the frozen ORM for this repository.
