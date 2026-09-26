# Environment Variables Guide

All environment variables are validated using Zod in `src/lib/env.ts`.

> **Non-Breaking Optional Variable Policy**: All AI, QStash, ML, and speech provider keys are configured as `.optional()` in `src/lib/env.ts`.
> The application starts and runs cleanly for standard web/SaaS projects without requiring any AI or ML keys.
> Keys are only validated when their respective capability is invoked at runtime.

---

## 1. Client-Side Variables (`NEXT_PUBLIC_`)

Exposed to browser JavaScript bundles:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Base application URL | `http://localhost:3000` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Publishable Key | `pk_test_...` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Catch-all sign-in route | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Catch-all sign-up route | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Redirect target post sign-in | `/dashboard` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Redirect target post sign-up | `/dashboard` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://[ref].supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key | `eyJhbGciOi...` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud-name` |

---

## 2. Server-Only Core Variables

Must **NEVER** be prefixed with `NEXT_PUBLIC_` and remain strictly on the server:

| Variable | Description | Purpose / Source |
| :--- | :--- | :--- |
| `CLERK_SECRET_KEY` | Clerk API Secret Key | Clerk Dashboard -> API Keys |
| `DATABASE_URL` | Postgres transaction pooler (port 6543) | Supabase -> Settings -> Database |
| `DIRECT_URL` | Postgres direct connection (port 5432) | Used for Drizzle migrations |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin key (bypasses RLS) | Supabase -> Settings -> API |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | Cloudinary Console |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | Cloudinary Console |
| `CLOUDINARY_URL` | Cloudinary connection string | Cloudinary Console |

---

## 3. Ephemeral Cache & Background Job Variables (Upstash)

| Variable | Description | Purpose / Source |
| :--- | :--- | :--- |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL | Caching, rate limiting, distributed locks |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST Token | Upstash Console -> Details -> REST API |
| `QSTASH_TOKEN` | Upstash QStash REST Token | Background jobs, delayed tasks, crons |
| `QSTASH_CURRENT_SIGNING_KEY` | Inbound QStash webhook signing key | Signature verification in `src/lib/qstash.ts` |
| `QSTASH_NEXT_SIGNING_KEY` | Next QStash signing key | Zero-downtime key rotation |

---

## 4. Optional AI, Speech & ML Provider Variables

Plug-and-play as needed during hackathons:

| Variable | Provider / Technology | Capability |
| :--- | :--- | :--- |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google AI Studio | Gemini 2.0 Flash / Pro multimodal models |
| `OPENAI_API_KEY` | OpenAI | GPT-4o, GPT-4o-mini, embeddings |
| `GROQ_API_KEY` | Groq | Ultra-low latency Llama-3.3 inference |
| `OPENROUTER_API_KEY` | OpenRouter | Unified multi-provider routing |
| `ANTHROPIC_API_KEY` | Anthropic | Claude 3.5 Sonnet reasoning models |
| `DEEPGRAM_API_KEY` | Deepgram | Nova-2/Nova-3 STT & Aura TTS |
| `LANGCHAIN_API_KEY` | LangSmith | Automated trace logging for LangGraph |
| `LANGCHAIN_TRACING_V2` | LangSmith | Set to `"true"` to enable tracing |
| `LANGCHAIN_PROJECT` | LangSmith | Project trace group name |
| `MLFLOW_TRACKING_URI` | MLflow | Remote ML experiment tracking server |

---

## Security Rules

- `.env.local` is strictly ignored by Git and must NEVER be committed.
- `.env.example` is committed and contains blank/safe template placeholders.
