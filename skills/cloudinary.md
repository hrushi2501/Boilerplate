# Skill: Cloudinary

## When to Use

Use when implementing image or media uploads, media optimization, asset transformations, or media URL generation.

## Important Conventions

- **Server Utility**: `src/lib/cloudinary.ts` exports the configured `cloudinary` SDK instance, `generateSignedUploadParams()`, and `getOptimizedImageUrl()`.
- **Client Components**: Use `next-cloudinary` components (`<CldImage />`, `<CldUploadWidget />`) for declarative transformations and widgets.
- **Signed Uploads**: Always use server-generated signatures for direct browser uploads to protect API credentials.

## Things to Avoid

- Do NOT expose `CLOUDINARY_API_SECRET` to the client/browser.
- Do NOT build an elaborate custom media management system unless requested.
- Do NOT serve raw, unoptimized images directly when Cloudinary auto-format/auto-quality (`f_auto,q_auto`) is available.

## Required Environment Variables

- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- Or `CLOUDINARY_URL`
