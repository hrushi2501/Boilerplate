# Skill: Agent Architectures & Patterns

## When to Use

Use this skill when designing autonomous or semi-autonomous agent systems, coordinating multi-agent teams, or implementing structured reasoning workflows.

---

## Canonical Agent Patterns

### 1. ReAct (Reason → Act → Observe)

The foundation of modern tool-calling agents:

- **Reason**: The model inspects the current state, goal, and conversation history to formulate a plan.
- **Act**: The model issues a structured tool invocation with validated parameters.
- **Observe**: The application executes the tool and returns the observation result to the model context.
- **Repeat / Conclude**: The loop continues until the agent generates a final answer or reaches `maxSteps`.

### 2. Router Pattern

Routes incoming user requests to dedicated specialized agents or tools based on classification:

```text
User Input ──► Classifier / Router ──┬──► Code Specialist
                                     ├──► Database / SQL Specialist
                                     └──► Customer Support Specialist
```

- Reduces prompt bloat and token consumption by only exposing relevant tools and instructions to each specialist.

### 3. Supervisor Pattern

A centralized supervisor agent coordinates multiple worker agents:

```text
                  ┌──────────────┐
                  │  Supervisor  │
                  └──┬────────┬──┘
         ┌───────────┘        └───────────┐
         ▼                                ▼
   ┌────────────┐                   ┌────────────┐
   │ Researcher │                   │  Analyst   │
   └────────────┘                   └────────────┘
```

- The supervisor maintains global state, assigns subtasks to workers, synthesizes responses, and determines termination.

### 4. Planner / Executor Pattern

Separates high-level strategy from execution:

- **Planner**: Deconstructs a high-level goal into an ordered list of atomic sub-tasks.
- **Executor**: Executes each step sequentially with bounded tools.
- **Verifier**: Inspects output quality before marking the step complete.

### 5. Evaluator / Optimizer (Reflection)

```text
Generate Output ──► Evaluator (Critique & Score) ──┬──► [Pass] ──► Finalize
                          ▲                        │
                          └─── [Fail] (Improve) ───┘
```

- Great for high-precision generation (code, SQL, analytical reports).
- Must have a hard limit on iteration cycles (maximum 2-3 passes).

### 6. Human-in-the-Loop (Approval Gate)

For high-consequence operations (sending emails, modifying records, financial transactions):

- The agent halts execution, emits an approval request payload, and waits for a signed user confirmation before proceeding.

---

## The 6 Pillars of Every Agent

Every agent in this repository MUST be built with:

1. **Clear, Single Responsibility**: Do not build a single monolithic "everything agent". Define bounded personas.
2. **Bounded Tools**: Only expose the minimal set of tools required for the agent's task.
3. **Structured Inputs & Outputs**: All agent communication and tool parameters must use strict Zod schemas.
4. **Structured Error Handling**: Tool failures must return descriptive error strings (not throw uncaught exceptions), allowing the model to attempt self-correction.
5. **Deterministic Termination**: Always enforce `maxSteps`, `maxIterations`, or explicit termination tokens. Never allow unbounded `while(true)` loops.
6. **Authorization Guardrails**: The agent must inherit the authenticated user's permissions via Clerk `auth()`. An agent must NEVER have higher privileges than the calling user.

---

## Things to Avoid

- **Do NOT create autonomous loops without timeouts or iteration caps.**
- **Do NOT give agents access to raw, unparameterized database execution.**
- **Do NOT build complex multi-agent graphs when a simple single-turn prompt or tool call solves the problem.**
