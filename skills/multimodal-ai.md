# Skill: Multimodal AI (Vision, Audio & Documents)

## When to Use

Use this skill when processing inputs that combine text with images, photos, charts, scanned forms, audio clips, or video files.

---

## Canonical Multimodal Model Strategy

> **Hackathon Pragmatism**: Use frontier multimodal APIs (Google Gemini 2.0 Flash, OpenAI GPT-4o-mini) rather than deploying heavy, fragile local vision/speech models. They are cheaper, faster, and handle complex OCR and reasoning in a single call.

---

## Pattern 1: Image Inspection & Chart Reasoning

```ts
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function analyzeChartImage(imageUrl: string, prompt: string) {
  const result = await generateText({
    model: google("gemini-2.0-flash"),
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image", image: new URL(imageUrl) },
        ],
      },
    ],
  });

  return result.text;
}
```

---

## Pattern 2: Multimodal Structured Extraction

Extracting structured data from screenshots, diagrams, or photos directly into Zod schemas:

```ts
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const nutritionLabelSchema = z.object({
  productName: z.string(),
  calories: z.number(),
  proteinGrams: z.number(),
  carbGrams: z.number(),
  fatGrams: z.number(),
  allergens: z.array(z.string()),
});

export async function extractNutrition(imageBuffer: Buffer) {
  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: nutritionLabelSchema,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Parse this nutrition facts label into structured fields." },
          { type: "image", image: imageBuffer },
        ],
      },
    ],
  });

  return object;
}
```

---

## Performance & Cost Tips for Multimodal Input

1. **Resize Large Images**: Scale down ultra-high-resolution images (e.g. 4000x3000 down to 1024x768) before sending to the model. This preserves visual clarity for OCR while cutting latency and token usage by 60-80%.
2. **Compress Formats**: Use WebP or JPEG over uncompressed PNG where possible.
3. **Store in Cloudinary**: Upload user media to Cloudinary first; pass the resulting CDN URL to the vision model.
