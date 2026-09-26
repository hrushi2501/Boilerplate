# Skill: Deepgram Voice AI (Speech-to-Text & Text-to-Speech)

## When to Use

Use **Deepgram** when building voice-enabled applications, speech-to-text (STT) transcription, real-time voice bots, podcast/meeting intelligence, or human-sounding text-to-speech (TTS) streaming.

- **STT Models**: `nova-3` / `nova-2` (industry-leading accuracy, ultra-low latency, multi-language support, speaker diarization, smart formatting).
- **TTS Models**: `aura-asteria-en`, `aura-luna-en`, `aura-orion-en`, `aura-arcas-en` (sub-200ms latency for conversational voice agents).

---

## Architecture: Real-Time Conversational Voice Agent

```text
 ┌─────────────────┐
 │ Browser / User  │
 └────────┬────────┘
          │ 1. Mic audio (WebSocket)
          ▼
 ┌─────────────────┐
 │  Deepgram STT   │ ──► Real-time transcript text
 └────────┬────────┘
          │ 2. Text tokens
          ▼
 ┌─────────────────┐
 │ Next.js AI SDK  │ ──► Streamed LLM response tokens
 └────────┬────────┘
          │ 3. Text chunks
          ▼
 ┌─────────────────┐
 │  Deepgram TTS   │ ──► Low-latency audio stream
 └────────┬────────┘
          │ 4. Audio bytes
          ▼
 ┌─────────────────┐
 │ Browser Speaker │
 └─────────────────┘
```

---

## 1. Speech-to-Text (STT): Pre-Recorded Audio (Server-Side)

Transcribe uploaded audio/video files (Cloudinary URL or raw buffer) using the Deepgram REST API:

```ts
// src/lib/deepgram-stt.ts
export async function transcribeAudioUrl(audioUrl: string) {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) throw new Error("Missing DEEPGRAM_API_KEY");

  const endpoint = new URL("https://api.deepgram.com/v1/listen");
  endpoint.searchParams.set("model", "nova-2");
  endpoint.searchParams.set("smart_format", "true");
  endpoint.searchParams.set("diarize", "true"); // Speaker detection
  endpoint.searchParams.set("punctuate", "true");

  const response = await fetch(endpoint.toString(), {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: audioUrl }),
  });

  if (!response.ok) {
    throw new Error(`Deepgram STT failed: ${response.statusText}`);
  }

  const data = await response.json();
  const transcript = data.results?.channels[0]?.alternatives[0]?.transcript ?? "";
  const words = data.results?.channels[0]?.alternatives[0]?.words ?? [];

  return { transcript, words };
}
```

---

## 2. Browser Real-Time STT (Zero-Secret Client Token Pattern)

> ⚠️ **SECURITY RULE**: Never put `DEEPGRAM_API_KEY` into browser client components!
> Instead, generate a short-lived (10-second), scoped temporary key from a Next.js Route Handler.

### Step 1: Temporary Token Endpoint (`/api/deepgram/token/route.ts`)

```ts
// src/app/api/deepgram/token/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Deepgram API key not configured" }, { status: 500 });
  }

  // Request a temporary scoped API key valid for 10 seconds to initiate WebSocket
  const response = await fetch("https://api.deepgram.com/v1/projects", {
    headers: { Authorization: `Token ${apiKey}` },
  });
  const projects = await response.json();
  const projectId = projects.projects?.[0]?.project_id;

  const keyResponse = await fetch(`https://api.deepgram.com/v1/projects/${projectId}/keys`, {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      comment: `Ephemeral token for user ${userId}`,
      scopes: ["usage:write"],
      time_to_live_in_seconds: 30,
    }),
  });

  const keyData = await keyResponse.json();
  return NextResponse.json({ key: keyData.key });
}
```

### Step 2: Browser WebSocket Streaming

```ts
// In client component:
// 1. Fetch ephemeral key from /api/deepgram/token
// 2. Open WebSocket to: wss://api.deepgram.com/v1/listen?model=nova-2&smart_format=true
// 3. Pipe MediaRecorder audio chunks to socket.send()
```

---

## 3. Text-to-Speech (TTS): Streaming Audio Generation

Synthesize natural speech with Deepgram Aura:

```ts
// src/app/api/tts/route.ts
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { text, voice = "aura-asteria-en" } = await req.json();
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) return new Response("Deepgram not configured", { status: 500 });

  const response = await fetch(`https://api.deepgram.com/v1/speak?model=${voice}`, {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    return new Response("TTS generation failed", { status: 502 });
  }

  // Stream raw audio (MP3/Linear16) directly back to browser
  return new Response(response.body, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Transfer-Encoding": "chunked",
    },
  });
}
```

---

## Performance & Cost Optimization

1. **Smart Formatting**: Always enable `smart_format=true` on STT to automatically punctuate, capitalize, and format dates/currencies without calling an extra LLM post-processing step.
2. **Audio Compression**: Send Opus or AAC audio rather than uncompressed 48kHz WAV to reduce network bandwidth and browser latency.
3. **Voice Selection**: `aura-asteria-en` (warm, natural female), `aura-orion-en` (crisp, professional male).
