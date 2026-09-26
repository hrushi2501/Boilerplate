# Skill: Security

## When to Use

Use when managing secrets, environment variables, authentication checks, SQL queries, user inputs, or external API communications.

## Important Conventions

- **Zero Secrets in Code**: Never commit API keys, service role credentials, or database passwords. Keep `.env.local` ignored by git.
- **Client vs. Server Separation**: Only prefix variables with `NEXT_PUBLIC_` if they are safe to be exposed in the browser bundle.
- **Parameterized SQL**: Always query through Drizzle ORM or parameterized prepared statements; prevent SQL injection.
- **Input Validation**: Validate all inputs at the boundary using `zod` schemas before executing database writes or triggering API calls.
- **Authentication Guards**: Protect server resources with `await auth.protect()` or `const { userId } = await auth();`. Never trust client-sent user IDs for authorization.

## Things to Avoid

- Do NOT disable security protections (CORS, CSRF, auth checks) merely to get something to work faster.
- Do NOT expose `CLERK_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, or `CLOUDINARY_API_SECRET` to client components.
- Do NOT use `dangerouslySetInnerHTML` unless input is thoroughly sanitized.
- Do NOT execute raw untyped queries with concatenated strings.
