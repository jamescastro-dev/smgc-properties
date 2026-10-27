"use client";

import { useEffect } from "react";

// Registers the PWA service worker once the admin loads. Rendered inside the
// admin layout so registration happens the first time Shella opens the app.
export default function RegisterSW() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      // Scoped to /admin so the offline fallback (an admin screen) never takes
      // over public pages on the admin's own phone.
      navigator.serviceWorker
        .register("/sw.js", { scope: "/admin" })
        .catch((err) => console.error("[pwa] SW registration failed:", err));
    };

    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
      return () => window.removeEventListener("load", register);
    }
  }, []);

  return null;
}
