# Skill: Hugging Face Ecosystem & Serverless Inference

## When to Use

Use Hugging Face when leveraging the world's open-weights model catalog for NLP, vision, audio, or multimodal tasks.

---

## Hosted Inference API vs. Local Inference

| Approach | When to Choose | Advantages | Disadvantages |
| :--- | :--- | :--- | :--- |
| **Serverless Inference API** (Recommended) | Hackathon speed, zero infrastructure, no GPU needed | Call models directly via HTTP from Next.js, no Python server to maintain | Cold starts on infrequently used models, rate limits |
| **Local / Container Inference** | Specialized custom fine-tuned weights, strictly offline or zero-network constraint | Full control over hardware and latency | Requires managing Python environment, GPU/RAM overhead |

---

## Calling Hugging Face Serverless API directly from Next.js

You can query thousands of open-source models directly from Next.js without running any Python backend:

```ts
// src/lib/huggingface.ts
export async function queryHuggingFace(model: string, data: Record<string, unknown>) {
  const token = process.env.HUGGINGFACE_API_KEY;
  if (!token) throw new Error("Missing HUGGINGFACE_API_KEY");

  const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HF API error: ${response.statusText}`);
  }

  return await response.json();
}
```

### Quick Use Cases & Models

- **Sentiment Analysis**: `distilbert-base-uncased-finetuned-sst-2-english`
- **Named Entity Recognition (NER)**: `dslim/bert-base-NER`
- **Text Summarization**: `facebook/bart-large-cnn`
- **Image Classification**: `google/vit-base-patch16-224`
- **Object Detection**: `facebook/detr-resnet-50`

---

## Hackathon Pragmatism Rule

> If a model is available on the Hugging Face Serverless Inference API or as an API on Groq/OpenAI/Gemini, **use the API**.
> Do not spend 3 hours of a hackathon debugging CUDA driver mismatches or PyTorch wheel installations on your laptop.
