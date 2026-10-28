"use client";

import { Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { captureLeadSource } from "@/lib/leadSource";

export default function ConditionalLayout({
  children,
  footer,
}: {
  children: React.ReactNode;
  /** Rendered by the (server) root layout and passed in, so the footer stays
   * a server component and ships no JavaScript. */
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // Remember how this visitor arrived, for attribution on any lead they send.
  useEffect(() => {
    if (!isAdmin) captureLeadSource();
  }, [isAdmin]);

  return (
    <>
      {!isAdmin && <Suspense><Navbar /></Suspense>}
      {children}
      {!isAdmin && footer}
    </>
  );
}
