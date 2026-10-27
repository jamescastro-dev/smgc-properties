import type { Metadata, Viewport } from "next";
import AdminLayoutClient from "./AdminLayoutClient";

// The home-screen app is the admin only. This lives here, not in the root
// layout, so public pages don't advertise "Shella Admin" as an installable app
// or iOS home-screen title to buyers.
export const metadata: Metadata = {
  manifest: "/admin.webmanifest",
  // iOS home-screen app: full-screen standalone launch. No `icons` here: that
  // would replace the site favicon on admin pages, and an icon under /admin sits
  // behind the auth middleware. iOS fetches /apple-touch-icon.png by convention.
  appleWebApp: {
    capable: true,
    title: "Shella Admin",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  // Dark browser/status-bar chrome + let content extend under the notch so the
  // admin's safe-area padding can position it correctly in standalone mode.
  themeColor: "#0a0a0a",
  viewportFit: "cover",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
