# Skill: TanStack Query

## When to Use

Use TanStack Query (`@tanstack/react-query`) as the standard server-state management layer for client-side fetching, caching, background synchronization, and server mutations.

## Architecture Principle

- **Remote / Server State**: Managed strictly with **TanStack Query**.
- **Local UI State**: Managed with standard **React `useState` / `useReducer` / URL search params**.
- **No Extra Global State**: Do NOT introduce Redux, Zustand, or MobX unless a future product requirement genuinely necessitates complex client-only state machines.

## Conventions & Best Practices

### 1. Query Keys

Always define query keys as structured array tuples for predictable invalidation:

```ts
// Entity list
const todosKey = ["todos"] as const;
// Filtered/paginated list
const todosListKey = (filters: Filters) => ["todos", "list", filters] as const;
// Single entity
const todoDetailKey = (id: string) => ["todos", "detail", id] as const;
```

### 2. Queries & Data Fetching

```ts
const { data, isLoading, isError, error } = useQuery({
  queryKey: ["items", page, limit],
  queryFn: () => fetchItems({ page, limit }),
  staleTime: 60 * 1000, // 1 minute
});
```

### 3. Mutations & Invalidation

Always invalidate relevant query keys on successful mutations:

```ts
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: createItemAction,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["items"] });
  },
});
```

### 4. Optimistic Updates

For instant feedback in rapid UX workflows:

```ts
const mutation = useMutation({
  mutationFn: updateItem,
  onMutate: async (newItem) => {
    await queryClient.cancelQueries({ queryKey: ["items"] });
    const previous = queryClient.getQueryData(["items"]);
    queryClient.setQueryData(["items"], (old: any) => [...old, newItem]);
    return { previous };
  },
  onError: (err, newItem, context) => {
    queryClient.setQueryData(["items"], context?.previous);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["items"] });
  },
});
```

### 5. Integration with TanStack Table

Standard pipeline:

```text
TanStack Query (fetches & caches dataset / pagination state)
      ↓
TanStack Table (manages sorting, filtering, columns headlessly)
      ↓
shadcn/ui + Tailwind (renders accessible markup: Table, Header, Body, Row)
```

- **Large datasets (>100 items)**: Pass pagination/sort parameters to TanStack Query and fetch paginated slices from the server.
- **Small datasets (<100 items)**: Fetch full dataset with TanStack Query and let TanStack Table sort/filter on the client.
