# Skill: Clerk Authentication

## When to Use

Use when implementing user authentication, session protection, user profile management, or authorization guards.

## Important Conventions

- **Version Standard**: Configured for Clerk Core 3 (`@clerk/nextjs`).
- **Conditional Rendering**: Use `<Show when="signed-in">` and `<Show when="signed-out">` from `@clerk/nextjs` (note: `<SignedIn>` and `<SignedOut>` are removed in Core 3).
- **Resource Protection**: Move auth guards directly into Server Components / Layouts using `const { userId } = await auth();` or `await auth.protect();`.
- **Proxy/Middleware**: Managed via `src/proxy.ts` using `clerkMiddleware()`.
- **Client Components**: Use `<UserButton />`, `<SignInButton />`, `<SignUpButton />`.
- **Catch-All Pages**: Sign-in at `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx` and sign-up at `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx`.

## Things to Avoid

- Do NOT use deprecated `createRouteMatcher` with manual path matching in middleware.
- Do NOT use removed `<SignedIn>` or `<SignedOut>` components; use `<Show when="...">`.
- Do NOT hardcode publishable keys or secrets.

## Required Environment Variables

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (format: `pk_test_...`)
- `CLERK_SECRET_KEY` (format: `sk_test_...`)
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard`
