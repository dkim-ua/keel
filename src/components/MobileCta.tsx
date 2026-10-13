"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Arrow } from "./ui/Button";

/**
 * Phones only: a "Discuss your project" button pinned to the bottom of the screen.
 * Shows after the first screen, hides while the request form or the footer is on
 * screen, and never on the contact page itself.
 */
export function MobileCta({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [covered, setCovered] = useState(false);
  const onContactPage = pathname?.endsWith("/contact") ?? false;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const targets = Array.from(document.querySelectorAll("#contact, footer"));
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      setCovered(visible.size > 0);
    });
    targets.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [pathname]);

  if (onContactPage) return null;
  const shown = scrolled && !covered;

  return (
    <div
      aria-hidden={!shown}
      className={`fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-6 transition-[opacity,transform] duration-500 ease-out-soft [background:linear-gradient(to_top,var(--color-bg)_55%,transparent)] md:hidden ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <Link
        href={href}
        tabIndex={shown ? undefined : -1}
        className="group flex h-13 items-center justify-center gap-2 rounded-full bg-accent text-[0.95rem] font-semibold text-accent-ink shadow-[0_12px_30px_-12px_var(--color-accent)] active:scale-[0.98]"
      >
        {label}
        <Arrow />
      </Link>
    </div>
  );
}
