# Skill: AI Streaming & Agent Progress UI

## When to Use

Use streaming when building interactive AI applications, real-time chatbots, or multi-step agent status visualizers. Streaming drastically reduces perceived latency by showing tokens and workflow transitions immediately as they occur.

---

## Core Streaming Capabilities

1. **Token-by-Token Text Streaming**: Real-time response generation.
2. **Structured Event Streaming**: Emitting lifecycle events from multi-step agent graphs (e.g. Planning → Searching → Analyzing → Verifying).
3. **Tool Call Execution Updates**: Showing which tool is executing and with what arguments.
4. **Error & Cancellation Handling**: Gracefully handling client disconnects or abort signals.

---

## Pattern 1: Data Stream Protocol (AI SDK)

Using `createDataStreamResponse` to stream text alongside custom lifecycle status events:

```ts
// src/app/api/agent/stream/route.ts
import { createDataStreamResponse, streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  return createDataStreamResponse({
    execute: async (dataStream) => {
      // 1. Emit Planning Event
      dataStream.writeData({ type: "status", message: "Planning execution steps..." });
      await new Promise((r) => setTimeout(r, 400));

      // 2. Emit Tool Calling Event
      dataStream.writeData({ type: "status", message: "Searching knowledge base..." });

      // 3. Stream Model Output
      const result = streamText({
        model: openai("gpt-4o-mini"),
        prompt,
      });

      result.mergeIntoDataStream(dataStream);
    },
  });
}
```

---

## Pattern 2: Client-Side Agent Progress UI

Display real workflow stages corresponding to actual backend events without faking timers:

```tsx
"use client";

import { useChat } from "ai/react";
import { Loader2, CheckCircle2, Search, Brain, FileCheck } from "lucide-react";

export function AgentStatusViewer() {
  const { messages, data, isLoading } = useChat({
    api: "/api/agent/stream",
  });

  // Extract custom event data streamed from server
  const currentStatus = data && data.length > 0 ? (data[data.length - 1] as { type: string; message: string }).message : null;

  return (
    <div className="space-y-4">
      {isLoading && currentStatus && (
        <div className="flex items-center gap-3 p-3 bg-muted/50 border rounded-lg text-sm text-muted-foreground animate-in fade-in duration-200">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span>{currentStatus}</span>
        </div>
      )}

      <div className="space-y-2">
        {messages.map((m) => (
          <div key={m.id} className="p-3 rounded-lg border bg-card text-card-foreground">
            <span className="font-semibold text-xs uppercase text-muted-foreground">{m.role}: </span>
            <p className="mt-1 whitespace-pre-wrap">{m.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Rules for Streaming Quality

1. **No Faked Delays in Production**: Progress states must map to real graph nodes or tool execution steps.
2. **Support User Cancellation**: Wire client `stop()` from `useChat` to the server `AbortSignal` so users can cancel long generations and save token costs.
3. **Handle Errors in Stream**: If a tool fails mid-stream, write a structured error event into the stream rather than breaking the HTTP connection silently.
