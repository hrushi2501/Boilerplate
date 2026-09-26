# Skill: Document Intelligence & File Ingestion

## When to Use

Use this skill when processing user-uploaded files (PDF, DOCX, TXT, CSV, images, scans) for indexing, RAG, automated data extraction, or conversational Q&A.

---

## Canonical Document Processing Pipeline

```text
 ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
 │ File Upload  │ ──► │ Validation   │ ──► │ Cloudinary / │ ──► │ Text & Data  │
 │ (Next.js UI) │     │ (Type, Size) │     │ Blob Storage │     │ Extraction   │
 └──────────────┘     └──────────────┘     └──────────────┘     └──────┬───────┘
                                                                       │
 ┌──────────────┐     ┌──────────────┐     ┌──────────────┐            │
 │ Supabase     │ ◄── │ Vector       │ ◄── │ Normalized   │ ◄──────────┘
 │ pgvector     │     │ Embeddings   │     │ Chunking     │
 └──────────────┘     └──────────────┘     └──────────────┘
```

---

## File Upload Validation Standards

Never trust client-reported file names or extensions. Always validate at the boundary:

```ts
// src/lib/file-validator.ts
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "text/plain",
  "text/csv",
  "image/png",
  "image/jpeg",
  "image/webp",
]);

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB

export function validateUploadedFile(file: File) {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File exceeds maximum allowed size of 15MB (${(file.size / 1024 / 1024).toFixed(1)}MB).`);
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}. Allowed: PDF, DOCX, TXT, CSV, PNG, JPG, WEBP.`);
  }

  return true;
}
```

---

## Extraction Tools by Format

| File Format | Recommended Tooling / Strategy | Notes |
| :--- | :--- | :--- |
| **Plain Text / Markdown** (`.txt`, `.md`) | Native UTF-8 string decoding | Zero dependencies, instant |
| **Structured CSV** (`.csv`) | `papaparse` or native streaming split | Preserve column headers in each row chunk |
| **PDF Documents** (`.pdf`) | `unpdf` or `@langchain/community/document_loaders/fs/pdf` | Extract text page-by-page to keep page numbers in chunk metadata |
| **Scanned Documents & Receipts** | Multimodal LLM (Gemini 2.0 Flash / GPT-4o-mini Vision) | Direct OCR + structured JSON extraction in one shot |

---

## Structured Document Extraction Pattern (Vision / OCR)

Using multimodal models to extract structured data directly from document images or PDF pages:

```ts
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const invoiceSchema = z.object({
  invoiceNumber: z.string(),
  vendor: z.string(),
  totalAmount: z.number(),
  currency: z.string().default("USD"),
  lineItems: z.array(
    z.object({
      description: z.string(),
      amount: z.number(),
    })
  ),
});

export async function parseInvoiceImage(imageUrl: string) {
  const { object } = await generateObject({
    model: google("gemini-2.0-flash"),
    schema: invoiceSchema,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Extract the structured invoice fields from this receipt." },
          { type: "image", image: new URL(imageUrl) },
        ],
      },
    ],
  });

  return object;
}
```
