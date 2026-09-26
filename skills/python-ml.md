# Skill: Python Machine Learning Architecture

## When to Use

Use this skill when your hackathon project requires classical machine learning, deep learning, computer vision, specialized NLP embeddings, or custom PyTorch/scikit-learn models.

---

## Architectural Separation Rule

> ⚠️ **CRITICAL RULE**: AI (LLMs / Prompts / Agents) and Classical ML (Weights / Tensors / scikit-learn / PyTorch) are NOT the same runtime.
> **NEVER install Python dependencies, PyTorch, or C-compilers into the Next.js / Bun runtime.**

The canonical architecture keeps Next.js completely decoupled from the Python ML worker:

```text
 ┌─────────────────────────┐
 │ Next.js App Router (Bun)│
 └───────────┬─────────────┘
             │ HTTP (JSON over REST)
             ▼
 ┌─────────────────────────┐
 │   FastAPI Python Service│
 └───────────┬─────────────┘
             │
   ┌─────────┼─────────┐
   ▼         ▼         ▼
sklearn   PyTorch  Transformers
```

---

## Recommended Project Structure

When an ML service is required, create a standalone `ml/` directory isolated from the Node.js project:

```text
ml/
├── app/
│   ├── main.py              # FastAPI application & endpoints
│   ├── schemas.py           # Pydantic request/response models
│   └── predictor.py         # Model loading & inference logic
├── models/
│   └── model.joblib         # Serialized model weights / artifacts
├── requirements.txt         # Minimal Python dependencies
└── Dockerfile               # Optional deployment container
```

---

## Communication Pattern (Next.js Side)

In Next.js Route Handlers or Server Actions, query the Python service like any external API:

```ts
// src/app/api/predict/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();

  const response = await fetch(`${ML_SERVICE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10000), // 10s timeout
  });

  if (!response.ok) {
    return NextResponse.json({ error: "ML prediction failed" }, { status: 502 });
  }

  const prediction = await response.json();
  return NextResponse.json(prediction);
}
```

---

## Rules for Hackathon Success

1. **Keep Python Lean**: Only include packages strictly needed (`fastapi`, `uvicorn`, `scikit-learn` or `torch`).
2. **Pre-train or Pre-serialize**: Do not train large models from scratch during the hackathon. Use transfer learning, pre-trained weights, or serialized checkpoints.
3. **Health Checks**: Always expose `GET /health` in the Python service for uptime monitoring.
