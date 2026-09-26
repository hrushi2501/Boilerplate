# Skill: LangGraph Agent Workflows

## When to Use

LangGraph (`@langchain/langgraph`) is the **canonical framework for stateful, multi-step agent workflows**. Use LangGraph when you need:

- Branching and conditional routing (e.g. routing between search, calculation, or DB query)
- Iterative cycles / evaluator-optimizer loops (e.g. write code → run test → reflect → refine)
- Human-in-the-loop interrupts (e.g. agent pauses for user confirmation before executing a financial transaction or database mutation)
- Durable checkpoints and state resumption (using Redis or Postgres checkpointers)
- Multi-agent coordination (supervisor coordinating specialist subgraphs)

## When NOT to Use

- **Do NOT** use LangGraph for simple single-prompt completions, basic chat interfaces, or linear two-step calls. Use Vercel AI SDK.
- **Do NOT** create graphs with unbounded cycles without explicit iteration counters.

---

## Canonical Agent Graph Architecture

```text
               ┌───────────┐
               │   START   │
               └─────┬─────┘
                     ▼
               ┌───────────┐
               │  Planner  │
               └─────┬─────┘
                     ▼
               ┌───────────┐
               │  Router   │
               └─────┬─────┘
                     ▼
        ┌────────────┴────────────┐
        ▼                         ▼
 ┌──────────────┐          ┌──────────────┐
 │ Specialist A │          │ Specialist B │
 └──────┬───────┘          └──────┬───────┘
        └────────────┬────────────┘
                     ▼
               ┌───────────┐
               │ Evaluator │
               └─────┬─────┘
                     │
           Is Output Acceptable?
          ┌──────────┴──────────┐
      No  │                     │ Yes
     (Max < 3)                  ▼
          │               ┌───────────┐
          └──────────────►│ Finalizer │
                          └─────┬─────┘
                                ▼
                          ┌───────────┐
                          │    END    │
                          └───────────┘
```

---

## Minimal Implementation Example

```ts
import { StateGraph, Annotation, END, START } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";

// 1. Define State Annotation
export const AgentState = Annotation.Root({
  messages: Annotation<string[]>({
    reducer: (curr, update) => curr.concat(update),
    default: () => [],
  }),
  iterationCount: Annotation<number>({
    reducer: (_, update) => update,
    default: () => 0,
  }),
  isSatisfied: Annotation<boolean>({
    reducer: (_, update) => update,
    default: () => false,
  }),
  finalAnswer: Annotation<string | null>({
    reducer: (_, update) => update,
    default: () => null,
  }),
});

// 2. Define Node Functions
async function researchNode(state: typeof AgentState.State) {
  const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.2 });
  const response = await model.invoke(state.messages.join("\n"));
  return {
    messages: [response.content.toString()],
    iterationCount: state.iterationCount + 1,
  };
}

async function evaluatorNode(state: typeof AgentState.State) {
  // Evaluates answer quality or checks constraints
  const satisfiesCriteria = state.iterationCount >= 2 || state.messages[state.messages.length - 1].length > 50;
  return {
    isSatisfied: satisfiesCriteria,
  };
}

async function finalizerNode(state: typeof AgentState.State) {
  return {
    finalAnswer: state.messages[state.messages.length - 1],
  };
}

// 3. Conditional Edge Logic
function shouldContinue(state: typeof AgentState.State) {
  if (state.isSatisfied || state.iterationCount >= 3) {
    return "finalize";
  }
  return "research";
}

// 4. Construct Graph
export function buildAgentGraph() {
  const workflow = new StateGraph(AgentState)
    .addNode("research", researchNode)
    .addNode("evaluator", evaluatorNode)
    .addNode("finalize", finalizerNode)
    .addEdge(START, "research")
    .addEdge("research", "evaluator")
    .addConditionalEdges("evaluator", shouldContinue, {
      research: "research",
      finalize: "finalize",
    })
    .addEdge("finalize", END);

  return workflow.compile();
}
```

---

## Human-in-the-Loop & Interrupts

LangGraph supports native interrupts before risky operations:

```ts
// Compile graph with interrupt before a sensitive tool or mutation
const app = workflow.compile({
  interruptBefore: ["execute_database_mutation"],
});
```

To resume after approval:

```ts
// Thread ID identifies the execution state in checkpointer
await app.invoke(null, { configurable: { thread_id: "user-session-123" } });
```

---

## Checkpointing & State Persistence

- **Short-term ephemeral state**: In-memory checkpointer (`MemorySaver`) for development.
- **Production state**: Redis checkpointer (`@langchain/langgraph-checkpoint-redis`) or Postgres checkpointer for durable, interruptible workflows across serverless invocations.
- **Background Execution**: Trigger long-running graphs asynchronously using **Upstash QStash** to prevent HTTP request timeouts on Vercel.

---

## Non-Negotiable Operational Rules

1. **Iteration Bounds**: Every cyclical graph MUST have a hard-coded maximum iteration limit (e.g. `iterationCount >= 3`) to prevent infinite looping and runaway billing.
2. **Explicit Reducers**: Define state reducers carefully so state merges deterministically across parallel branches.
3. **Structured Tool I/O**: Tools called within nodes must validate inputs and outputs with Zod.
