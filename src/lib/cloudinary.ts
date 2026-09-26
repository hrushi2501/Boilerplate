import { v2 as cloudinary } from "cloudinary";

/**
 * Cloudinary Server Configuration
 *
 * Configured using environment variables:
 * - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
 * - CLOUDINARY_API_KEY
 * - CLOUDINARY_API_SECRET
 * Or CLOUDINARY_URL
 */
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/**
 * Helper to generate signed upload parameters for secure client-side uploads
 */
export function generateSignedUploadParams(folder = "hackathon-uploads") {
  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET ?? "",
  );

  return {
    timestamp,
    folder,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  };
}

/**
 * Helper to get optimized media URL with transformations
 */
export function getOptimizedImageUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
  },
) {
  return cloudinary.url(publicId, {
    fetch_format: "auto",
    quality: options?.quality ?? "auto",
    width: options?.width,
    height: options?.height,
    crop: options?.crop ?? "limit",
    secure: true,
  });
}
