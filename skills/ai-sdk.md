# Skill: Vercel AI SDK Integration

## When to Use

Use Vercel AI SDK (`ai`, `@ai-sdk/openai`, `@ai-sdk/google`, `@ai-sdk/anthropic`, `@ai-sdk/groq`) as the **default first choice** for:

- Chatbots, completion endpoints, and streaming UI
- Type-safe structured output generation (`generateObject`, `streamObject`)
- Single-turn or lightweight tool calling
- Multimodal input prompts (images, audio, documents)
- Standard SaaS AI features requiring minimal overhead and zero graph machinery

> **Golden Rule**: Simple AI application → **AI SDK first**. Do NOT use LangGraph or LangChain for a simple chatbot or straightforward streaming completion.

---

## Core Patterns

### 1. Streaming Text & Chat (App Router Route Handler)

```ts
// src/app/api/chat/route.ts
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai"; // or google("gemini-2.0-flash"), etc.
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: "You are a concise, helpful hackathon assistant.",
    messages,
    maxTokens: 1000,
  });

  return result.toDataStreamResponse();
}
```

### 2. Client-Side Chat Hook (`ai/react`)

```tsx
"use client";

import { useChat } from "ai/react";

export function ChatBox() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    <div className="flex flex-col h-125 border rounded-lg p-4">
      <div className="flex-1 overflow-y-auto space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "text-right font-medium" : "text-left text-muted-foreground"}>
            <span>{m.content}</span>
          </div>
        ))}
        {isLoading && <p className="text-xs text-muted-foreground animate-pulse">Thinking...</p>}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask a question..."
          className="flex-1 border rounded px-3 py-2 text-sm"
        />
        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm">
          Send
        </button>
      </form>
    </div>
  );
}
```

### 3. Type-Safe Structured Output (`generateObject`)

```ts
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const taskSchema = z.object({
  title: z.string(),
  priority: z.enum(["low", "medium", "high"]),
  estimatedMinutes: z.number(),
  tags: z.array(z.string()),
});

export async function extractTask(userPrompt: string) {
  const { object } = await generateObject({
    model: google("gemini-2.0-flash"),
    schema: taskSchema,
    prompt: `Extract task metadata from: "${userPrompt}"`,
  });

  return object; // Fully typed as z.infer<typeof taskSchema>
}
```

### 4. Tool Calling with Zod

```ts
import { generateText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const result = await generateText({
  model: openai("gpt-4o-mini"),
  tools: {
    getWeather: tool({
      description: "Get the current weather for a location",
      parameters: z.object({
        city: z.string().describe("City name"),
      }),
      execute: async ({ city }) => {
        // Query external API or DB
        return { city, temperature: 72, condition: "Sunny" };
      },
    }),
  },
  maxSteps: 3, // Enable automatic multi-step tool call resolution
  prompt: "What is the weather in San Francisco?",
});
```

---

## Provider Configuration & Model Switching

Keep provider selection flexible and driven by environment variables:

```ts
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";

export function getDefaultModel() {
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return google("gemini-2.0-flash");
  }
  if (process.env.GROQ_API_KEY) {
    return groq("llama-3.3-70b-versatile");
  }
  return openai("gpt-4o-mini");
}
```

---

## Performance, Cost & Security Rules

1. **Server-Side Only**: AI SDK provider keys (`OPENAI_API_KEY`, etc.) must NEVER be accessed in client code.
2. **Cost & Token Budgets**: Always specify `maxTokens` on generation calls to prevent runaway bill shock.
3. **Model Tiering**: Use fast/cheap models (`gpt-4o-mini`, `gemini-2.0-flash`, `llama-3.3-70b`) for standard tasks; reserve expensive flagship models for complex reasoning.
4. **Boundary Validation**: Authenticate requests with Clerk `auth()` before streaming AI responses.
5. **No Infinite Steps**: Set bounded `maxSteps` (e.g., 3-5) when using multi-step tool calling.
