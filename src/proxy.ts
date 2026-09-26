import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * Next.js Proxy (Middleware)
 *
 * Integrates Clerk authentication session handling with Next.js.
 * Protection is handled resource-side (e.g. in layouts/routes using `await auth.protect()`).
 */
export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Always run for Clerk endpoints
    "/__clerk/:path*",
  ],
};
