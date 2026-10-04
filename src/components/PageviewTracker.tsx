"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Sends one page view per route change to /api/track. No cookies, no personal data. */
export function PageviewTracker() {
  const pathname = usePathname();
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname === last.current) return;
    const isFirst = last.current === null;
    last.current = pathname;

    const body = JSON.stringify({
      path: pathname,
      // Only the first view of a visit can come from another site.
      referrer: isFirst ? document.referrer : "",
    });
    try {
      if (navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }))) return;
    } catch {
      /* fall through */
    }
    fetch("/api/track", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
  }, [pathname]);

  return null;
}
