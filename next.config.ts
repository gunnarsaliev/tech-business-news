import type { NextConfig } from "next"

// The CMS and, when set, the backup CMS tried if the first one is down.
const payloadUrls = [process.env.PAYLOAD_API_URL ?? "http://localhost:3000", process.env.PAYLOAD_API_BACKUP_URL]
  .filter((url): url is string => Boolean(url))
  .map((url) => new URL(url))
const isLocalPayload = payloadUrls.some((url) => ["localhost", "127.0.0.1"].includes(url.hostname))
// Public bucket the CMS stores uploads in; media URLs point here instead of /api/media.
const r2PublicUrl = process.env.R2_PUBLIC_URL

const nextConfig: NextConfig = {
  images: {
    // Allow next/image to optimize media served by Payload CMS, its R2 bucket and Unsplash.
    remotePatterns: [
      ...payloadUrls.map((url) => new URL("/api/media/**", url)),
      ...(r2PublicUrl ? [new URL("/**", r2PublicUrl)] : []),
      // Object form (no `search`) so Unsplash sizing params like ?w=1600 are allowed.
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
    // Needed only while a CMS runs on this machine.
    dangerouslyAllowLocalIP: isLocalPayload,
  },
  async rewrites() {
    return {
      // Checked before pages, so /<category>/<post>.md reaches the Markdown handler, not the catch-all page.
      beforeFiles: [{ source: '/:path+.md', destination: '/api/md/:path+' }],
    }
  },
}

export default nextConfig
