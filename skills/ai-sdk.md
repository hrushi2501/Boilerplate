# Skill: AI SDK & LLM Integration

## When to Use

Use when integrating LLM providers, chat interfaces, streaming responses, embeddings, or agentic tooling into the application.

## Important Conventions

- **Vercel AI SDK**: Prefer `ai` and `@ai-sdk/openai` or `@ai-sdk/anthropic` for unified streaming, tool calling, and structured outputs.
- **Streaming Responses**: Stream text directly from Route Handlers (`return result.toDataStreamResponse()`) or Server Actions.
- **Structured Outputs**: Use `generateObject` with Zod schemas to guarantee type-safe LLM outputs.
- **Client Hooks**: Use `useChat` or `useCompletion` from `ai/react` for seamless chat interfaces.
- **Provider Keys**: Configure `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, or custom endpoint in server-side routes only.

## Things to Avoid

- Do NOT expose LLM API keys to the browser.
- Do NOT make long-running blocking LLM calls on the client side without progress or streaming indicators.
- Do NOT parse LLM text output with fragile regex when structured output schemas (`generateObject`) are available.
