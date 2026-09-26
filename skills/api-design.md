# Skill: API Design

## When to Use

Use when implementing Server Actions, Next.js Route Handlers (`src/app/api/...`), or external webhook endpoints.

## Important Conventions

- **Server Actions Preference**: In Next.js App Router, prefer Server Actions (`"use server"`) for form submissions and mutations over verbose REST endpoints.
- **Route Handlers**: Use `route.ts` only for external webhooks, file downloads/streaming, or public REST consumers.
- **Response Format**: Return consistent JSON response envelopes: `{ success: true, data: ... }` or `{ success: false, error: "..." }`.
- **Status Codes**: Return appropriate HTTP status codes (200, 201, 400 for validation errors, 401 for unauthenticated, 403 for unauthorized, 500 for internal errors).
- **Zod Validation**: Parse request payloads with Zod before processing.

## Things to Avoid

- Do NOT create unnecessary REST endpoints when a Server Action directly connected to a form or component is simpler.
- Do NOT expose internal database error stack traces to API clients.
- Do NOT process mutations without verifying user authentication.
