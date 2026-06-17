import type { NextConfig } from "next";

// Content-Security-Policy. Pragmatic (not nonce-based): pages are mostly
// statically prerendered, so a per-request nonce can't work with cached HTML —
// hence 'unsafe-inline' for Next's inline bootstrap scripts and inline styles.
// The high-value wins still hold: locked-down connect/img/frame sources,
// frame-ancestors 'none', object-src 'none', base-uri/form-action 'self'.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co",
  "font-src 'self' data:",
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