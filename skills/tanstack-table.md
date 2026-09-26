# Skill: TanStack Table

## When to Use

Use TanStack Table (`@tanstack/react-table`) as the default table engine for data-heavy UI, data grids, and tabular layouts requiring sorting, filtering, pagination, column visibility, or row selection.

## Headless Architecture

TanStack Table is **strictly headless**:

- **Logic & State**: Handled entirely by TanStack Table (`useReactTable`).
- **Presentation & Styling**: Controlled by shadcn/ui components (`Table`, `TableHeader`, `TableRow`, `TableCell`) and Tailwind CSS classes.
- Do NOT impose a visual design in the data logic layer.

## Column Definitions

Define columns with strict TypeScript types using `ColumnDef<T>`:

```tsx
import { ColumnDef } from "@tanstack/react-table";

interface Project {
  id: string;
  name: string;
  status: "active" | "archived";
  createdAt: string;
}

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "name",
    header: "Project Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "active" ? "default" : "secondary"}>
        {row.original.status}
      </Badge>
    ),
  },
];
```

## Client vs. Server-Side Data Handling

| Feature | Small Datasets (<100 rows) | Large Datasets (>100 rows) |
| :--- | :--- | :--- |
| **Strategy** | Client-side table models | Server-side execution |
| **Pagination** | `getPaginationRowModel: getPaginationRowModel()` | `manualPagination: true`, `pageCount: totalPages` |
| **Sorting** | `getSortedRowModel: getSortedRowModel()` | `manualSorting: true`, pass sort state to Query |
| **Filtering** | `getFilteredRowModel: getFilteredRowModel()` | `manualFiltering: true`, pass search query to server |

## Integration with TanStack Query

Combine TanStack Query and TanStack Table in a clean, decoupled flow:

```tsx
// 1. Fetch server state with TanStack Query
const { data, isLoading, isError } = useQuery({
  queryKey: ["projects", pagination.pageIndex, pagination.pageSize],
  queryFn: () => fetchProjects({ page: pagination.pageIndex, limit: pagination.pageSize }),
});

// 2. Pass data to TanStack Table
const table = useReactTable({
  data: data?.rows ?? [],
  columns,
  rowCount: data?.totalCount,
  state: { pagination },
  onPaginationChange: setPagination,
  manualPagination: true,
  getCoreRowModel: getCoreRowModel(),
});

// 3. Render with shadcn/ui Table components
```

## Performance & Best Practices

- **Memoization**: Always wrap `columns` in `useMemo` or declare them outside component render functions to prevent table recreation on every render.
- **Empty & Loading States**: Explicitly render `<Skeleton />` rows during `isLoading`, and an informative `<EmptyState />` when `rows.length === 0`.
- **Avoid Over-fetching**: Never fetch thousands of records to the client when a database index with `limit` and `offset` can return exact slices in milliseconds.
