# Stack Decisions & Rationale

| Category | Technology | Rationale |
| :--- | :--- | :--- |
| **Package Manager** | **Bun** | Instant installation, fast script execution, and native TypeScript execution without overhead. |
| **Framework** | **Next.js (App Router)** | Full-stack React with fast Turbopack compilation, Server Components, and seamless Vercel deployment. |
| **Styling & UI** | **Tailwind CSS v4 + shadcn/ui** | Zero-runtime CSS with modern theme variables and accessible, unstyled-yet-polished primitives. |
| **Linter / Formatter** | **Biome** | Sub-millisecond formatting and linting in a single binary, replacing both ESLint and Prettier. |
| **Primary Database** | **Supabase PostgreSQL** | Robust, scalable managed Postgres with connection pooling and storage infrastructure. Primary source of truth. |
| **ORM** | **Drizzle ORM** | Type-safe, SQL-like query builder with zero query-compilation overhead and instant migrations. |
| **Cache & Ephemeral** | **Upstash Redis** | Serverless REST-based in-memory store for caching, rate limiting, and ephemeral coordination. |
| **Server State** | **TanStack Query** | Declarative remote data fetching, automatic caching, background refetching, and optimistic updates. |
| **Table Engine** | **TanStack Table** | Headless table management for sorting, filtering, selection, and server-side pagination with shadcn/ui styling. |
| **Authentication** | **Clerk** | Turnkey authentication, session management, user buttons, and pre-built auth flows. |
| **Media CDN** | **Cloudinary** | Automatic image optimization (`f_auto,q_auto`), transformations, and signed uploads. |
| **Testing** | **Vitest + Playwright** | Fast unit testing with Vite and robust end-to-end browser smoke testing. |
| **Deployment** | **Vercel** | Git push-to-deploy with automatic preview environments and zero configuration. |
