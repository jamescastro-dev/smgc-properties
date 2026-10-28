import type { NextConfig } from "next";

// Content-Security-Policy. Pragmatic (not nonce-based): pages are mostly
// statically prerendered, so a per-request nonce can't work with cached HTML —
// hence 'unsafe-inline' for Next's inline bootstrap scripts and inline styles.
// The high-value wins still hold: locked-down connect/img/frame sources,
// frame-ancestors 'none', object-src 'none', base-uri/form-action 'self'.
// React's dev build uses eval() for its debugging tools (rebuilding call
// stacks); without it every dev page logs a CSP console error. Production
// never uses eval, so the deployed policy stays strict.
const isDev = process.env.NODE_ENV === "development";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co",
  "font-src 'self' data:",
  // PWA: service worker + web app manifest (both same-origin).
  "worker-src 'self'",
  "manifest-src 'self'",
  // Supabase REST/Auth over https, Realtime over wss
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  // YouTube video tours + Google Maps embeds
  "frame-src 'self' https://www.youtube.com https://www.google.com https://maps.google.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Stop the site (incl. the admin login) from being framed → clickjacking.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // Enforce HTTPS for 2 years incl. subdomains. Vercel already serves HTTPS.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  images: {
    // AVIF first: ~20–40% smaller than WebP for the same quality, which
    // matters most for the listing photos (the LCP on /properties).
    formats: ["image/avif", "image/webp"],
    // Optimized images stay cached for a month. Listing photo URLs never
    // change (a new upload gets a new URL), so long caching is safe and saves
    // re-encoding on Vercel's image quota.
    minimumCacheTTL: 60 * 60 * 24 * 31,
    // 60 for listing-card thumbnails (see PropertyCard), 75 (default) for
    // everything else. Next 16 only serves qualities listed here.
    qualities: [60, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;