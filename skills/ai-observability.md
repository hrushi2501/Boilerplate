# Skill: AI Observability & Tracing

## When to Use

Use observability when you need to inspect, debug, and monitor complex LLM chains, agent transitions, retrieval scores, latency bottlenecks, or token consumption.

> **Rule**: Observability is **optional**. Do NOT force complex observability dashboards into tiny, simple hackathon demos unless debugging or judging explicitly calls for it.

---

## Canonical Observability Stack

| Project Type | Canonical Tool | Configuration |
| :--- | :--- | :--- |
| **LangChain / LangGraph Agents** | **LangSmith** | Set `LANGCHAIN_TRACING_V2=true`, `LANGCHAIN_API_KEY`, `LANGCHAIN_PROJECT` |
| **Traditional ML + LLM Workflows** | **MLflow** | Set `MLFLOW_TRACKING_URI` |
| **Vercel AI SDK Projects** | **OpenTelemetry / Console Traces** | `experimental_telemetry: { isEnabled: true }` |

---

## 1. LangSmith Setup (Zero-Code Auto-Tracing)

LangSmith automatically intercepts and visualizes every LangChain and LangGraph node without rewriting application logic:

In `.env.local`:

```bash
LANGCHAIN_TRACING_V2="true"
LANGCHAIN_API_KEY="lsv2_pt_..."
LANGCHAIN_PROJECT="pravi-ai-hackathon"
```

What LangSmith provides out-of-the-box:

- Visual DAG of agent node executions and conditional branches
- Exact prompt inputs, raw model outputs, and token counts
- Tool call arguments, return values, and execution durations
- Latency breakdown per step

---

## 2. In-App Token & Latency Metrics Tracking

For quick hackathon demos that want to show real-time metrics in the UI without external dashboards:

```ts
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function trackedGeneration(prompt: string) {
  const startTime = performance.now();

  const result = await generateText({
    model: openai("gpt-4o-mini"),
    prompt,
  });

  const durationMs = Math.round(performance.now() - startTime);
  const { promptTokens, completionTokens, totalTokens } = result.usage;

  return {
    text: result.text,
    metrics: {
      durationMs,
      promptTokens,
      completionTokens,
      totalTokens,
    },
  };
}
```

---

## What to Monitor

1. **Token Spikes**: Monitor which prompt templates or documents are blowing up token budgets.
2. **Repeated Tool Failures**: Identify when an agent is hallucinating nonexistent tool parameters or failing schemas.
3. **Retrieval Score Degradation**: Detect when vector search returns low-confidence passages.
