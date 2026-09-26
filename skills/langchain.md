# Skill: LangChain Integration

## When to Use

Use LangChain (`@langchain/core`, `@langchain/community`, `@langchain/openai`, etc.) when you need:

- Document loaders and text splitters for processing heterogeneous files (PDF, DOCX, CSV, Markdown)
- Pre-built vector store abstractions and hybrid retrievers with Supabase pgvector
- LCEL (LangChain Expression Language) pipelines for complex prompt/retrieval/formatting chains
- Standardized tool primitives that feed into LangGraph agent nodes

## When NOT to Use (Avoid Overhead)

- **Do NOT** use LangChain for simple chat or streaming completions. Use Vercel AI SDK instead.
- **Do NOT** use monolithic legacy chains (`LLMChain`, `ConversationalRetrievalChain`). Use modern LCEL or standard async TypeScript functions.
- **Do NOT** install heavy LangChain sub-packages unless specific functionality (e.g. loaders, splitters) is actually required.

---

## Core Patterns

### 1. Document Loaders & Recursive Text Splitting

```ts
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function chunkText(rawText: string, metadata: Record<string, unknown> = {}) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  return await splitter.createDocuments([rawText], [metadata]);
}
```

### 2. LCEL RAG Pipeline

```ts
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { createClient } from "@supabase/supabase-js";

export function createRagChain() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const vectorStore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
    client: supabase,
    tableName: "documents",
    queryName: "match_documents",
  });

  const retriever = vectorStore.asRetriever({ k: 4 });

  const prompt = PromptTemplate.fromTemplate(`
You are a helpful domain assistant. Answer the user question based strictly on the provided context.
If the answer is not contained in the context, say "I cannot find sufficient information in the provided knowledge base."

Context:
{context}

Question:
{question}
`);

  const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 });

  return RunnableSequence.from([
    {
      context: retriever.pipe((docs) => docs.map((d) => d.pageContent).join("\n\n")),
      question: new RunnablePassthrough(),
    },
    prompt,
    model,
    new StringOutputParser(),
  ]);
}
```

### 3. Structured Outputs with Zod

```ts
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

const entitySchema = z.object({
  companies: z.array(z.string()),
  technologies: z.array(z.string()),
  summary: z.string(),
});

export async function extractEntities(text: string) {
  const model = new ChatOpenAI({ model: "gpt-4o-mini" });
  const structuredLlm = model.withStructuredOutput(entitySchema);

  return await structuredLlm.invoke(`Analyze the following text: ${text}`);
}
```

---

## Best Practices & Pitfalls

1. **Keep Pipelines Shallow**: Favor explicit TypeScript functions over deeply nested abstractions.
2. **Explicit Metadata**: Always attach document metadata (`source`, `userId`, `createdAt`) during chunking to enable tenant-isolated SQL filtering.
3. **Trace with LangSmith**: In development, set `LANGCHAIN_TRACING_V2=true` and `LANGCHAIN_API_KEY` to inspect prompt expansions and retriever chunks visually.
