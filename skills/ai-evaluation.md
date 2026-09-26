# Skill: AI Evaluation & Automated Testing

## When to Use

Use this skill to quantitatively evaluate LLM prompt changes, retrieval accuracy in RAG systems, and deterministic correctness in tool-calling agents.

> **Rule**: Do NOT rely solely on "vibes" or manual ad-hoc testing. Build small, fast, automated evaluation suites in Vitest.

---

## 1. RAG Evaluation Metrics (The Core 4)

When evaluating retrieval-augmented generation, test:

1. **Retrieval Precision**: Are retrieved chunks relevant to the user query, or is noise included?
2. **Retrieval Recall**: Did the vector search retrieve all passages needed to answer the question?
3. **Groundedness / Faithfulness**: Is the final LLM response strictly supported by retrieved context, or did it hallucinate?
4. **Answer Relevance**: Did the model directly address the user's specific prompt?

---

## 2. Deterministic Tool & Schema Testing (Vitest)

Test tool definitions and structured outputs with standard unit tests:

```ts
// tests/unit/tools.test.ts
import { describe, it, expect } from "vitest";
import { z } from "zod";

const taskSchema = z.object({
  title: z.string().min(1),
  priority: z.enum(["low", "medium", "high"]),
  estimatedMinutes: z.number().positive(),
});

describe("AI Structured Output Schemas", () => {
  it("validates well-formed output payload", () => {
    const mockOutput = {
      title: "Prepare presentation slides",
      priority: "high",
      estimatedMinutes: 45,
    };
    expect(() => taskSchema.parse(mockOutput)).not.toThrow();
  });

  it("rejects invalid priority enumeration", () => {
    const invalidOutput = {
      title: "Broken task",
      priority: "critical", // Not in enum
      estimatedMinutes: 10,
    };
    expect(() => taskSchema.parse(invalidOutput)).toThrow();
  });
});
```

---

## 3. Golden Dataset Evaluation Pattern

Maintain a lightweight JSON golden dataset (`tests/fixtures/eval-dataset.json`) containing inputs, expected tool calls, and baseline assertions:

```ts
import { describe, it, expect } from "vitest";

const goldenDataset = [
  {
    query: "Book a flight to NYC tomorrow",
    expectedIntent: "flight_booking",
    requiredParameters: ["destination"],
  },
  {
    query: "What is my account balance?",
    expectedIntent: "account_inquiry",
    requiredParameters: [],
  },
];

describe("Agent Intent Classifier", () => {
  for (const item of goldenDataset) {
    it(`classifies: "${item.query}"`, async () => {
      // Run deterministic router or fast classification model
      const classifiedIntent = "flight_booking"; // Mock or call classifyIntent(item.query)
      expect(classifiedIntent).toBe(item.expectedIntent);
    });
  }
});
```

---

## 4. Agent Trajectory Evaluation

When testing LangGraph or multi-step agents, evaluate:

- **Termination Guarantee**: The agent reaches `END` within `< maxSteps` without looping infinitely.
- **Tool Selection Correctness**: Validates that only appropriate tools were selected for given tasks.
- **Safety / Policy Compliance**: Verifies refusal behavior when prompted with out-of-scope or sensitive requests.
