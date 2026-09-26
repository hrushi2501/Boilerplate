# Security Conventions

## 1. Secrets Management

- Real secrets are strictly kept in `.env.local` and never tracked by Git.
- Verify Git ignore status with `git status` and `git check-ignore -v .env.local`.
- Check `.env.example` regularly to ensure no private keys or secrets are accidentally committed.

## 2. Authentication & Authorization

- **Clerk** manages user identities, passwords, sessions, and multi-factor auth.
- Protect server routes and layout wrappers using `await auth.protect()` or checking `const { userId } = await auth();`.
- Never trust client-supplied user identifiers (`userId`, `role`) passed via request body. Always read `userId` from the verified Clerk server session.

## 3. Database Security

- All database queries are executed through Drizzle ORM to ensure parameterized query compilation and prevent SQL injection.
- Keep `SUPABASE_SERVICE_ROLE_KEY` strictly on the server; client components only use the anonymous key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) governed by Supabase RLS.

## 4. Input & Output Hygiene

- Always validate incoming request payloads and form submissions with `zod`.
- Avoid `dangerouslySetInnerHTML`. If rendering Markdown or rich text, sanitize with a trusted sanitizer.
