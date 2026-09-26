# Skill: Comprehensive Error Handling & Resilient UI States

## When to Use

Use this skill across all API routes, database queries, AI invocations, external tool calls, and frontend UI components to prevent infinite loading spinners, unhandled promise rejections, or silent failures.

> **Absolute Rule**: **Never leave the user staring at a spinner forever.** Every operation must handle loading, success, empty, and failure states gracefully with actionable recovery UI.

---

## The 5 Mandatory UI States

Every view or data-fetching container must render:

1. **Loading State**: Accessible skeleton screens or subtle loaders (`<Skeleton />`, `<Loader2 className="animate-spin" />`). Never flash raw blank white screens.
2. **Success State**: The rendered data grid, cards, or chat output.
3. **Empty State**: Clear explanation of why no records exist with a primary Call to Action (e.g. "No documents uploaded yet. [Upload your first PDF]").
4. **Error State**: User-friendly explanation with a "Retry" button.
5. **Unauthorized State**: Prompting sign-in or permission upgrade without crashing.

---

## Standard Error Matrix & HTTP Statuses

| Category | HTTP Code | Recovery Strategy |
| :--- | :--- | :--- |
| **Validation Error** | `400 Bad Request` | Highlight specific input fields using Zod `flatten().fieldErrors` |
| **Authentication Error** | `401 Unauthorized` | Redirect to `/sign-in` or display Clerk `<SignInButton />` |
| **Authorization / Ownership** | `403 Forbidden` | Inform user they do not own or have access to this resource |
| **Not Found** | `404 Not Found` | Render clean empty state or 404 boundary |
| **Rate Limit** | `429 Too Many Requests` | Show countdown timer; back off with jitter; inform user of quota |
| **AI Generation Failure** | `502 / 503 Bad Gateway` | Fall back to alternative provider (e.g. Gemini → OpenAI) or offer retry |
| **Tool Execution Error** | Returned in JSON | Return `{ success: false, error: "..." }` so agent can adjust parameters |
| **Agent Max Iterations** | Bounded Loop | Terminate with graceful partial summary: "Goal partially complete." |

---

## Defensive Error Handling Pattern (Route Handlers)

```ts
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function handleRouteError(error: unknown) {
  console.error("API Route Error:", error);

  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Validation failed", details: error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    if (error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (error.message.includes("rate limit") || error.message.includes("429")) {
      return NextResponse.json(
        { error: "Provider rate limit reached. Please wait a moment." },
        { status: 429 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
}
```

---

## Client Error Boundary & React Query Fallbacks

When using TanStack Query:

```tsx
const { data, isLoading, isError, error, refetch } = useQuery({
  queryKey: ["items"],
  queryFn: fetchItems,
  retry: 2, // Auto-retry twice before failing
});

if (isLoading) return <LoadingSkeleton />;

if (isError) {
  return (
    <div className="p-6 border border-destructive/20 rounded-lg text-center space-y-3">
      <p className="text-sm text-destructive font-medium">{error?.message || "Failed to load data."}</p>
      <button onClick={() => refetch()} className="px-3 py-1.5 bg-secondary text-secondary-foreground text-xs rounded">
        Try Again
      </button>
    </div>
  );
}

if (!data || data.length === 0) {
  return <EmptyState title="No items found" description="Create an item to get started." />;
}
```
