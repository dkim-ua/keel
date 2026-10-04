"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/admin/actions";
import { Logo, LogoMark } from "@/components/ui/Logo";

const items = [
  { href: "/admin", label: "Обзор", icon: "M3 13h4v8H3zM10 8h4v13h-4zM17 3h4v18h-4z" },
  { href: "/admin/leads", label: "Заявки", icon: "M4 5h16v12H7l-3 3zM8 9h8M8 13h5" },
  { href: "/admin/cases", label: "Кейсы", icon: "M4 7h16v13H4zM9 7V4h6v3" },
];

export function AdminNav() {
  const pathname = usePathname();
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <aside className="sticky top-0 z-20 border-b border-line bg-surface/80 backdrop-blur lg:h-dvh lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-4 px-5 py-4 lg:flex-col lg:items-stretch lg:gap-8 lg:py-7">
        <Link href="/admin" className="flex shrink-0 items-center justify-between" aria-label="Keel Admin">
          <LogoMark className="size-7 text-fg lg:hidden" />
          <Logo className="max-lg:hidden" />
          <span className="ml-3 hidden font-mono text-[0.65rem] uppercase tracking-[0.14em] text-subtle lg:inline">Admin</span>
        </Link>
        <nav aria-label="Админ-панель" className="flex gap-1 overflow-x-auto lg:flex-col">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active(item.href) ? "page" : undefined}
              className={`flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${
                active(item.href) ? "bg-white/[0.06] text-fg" : "text-muted hover:bg-white/[0.03] hover:text-fg"
              }`}
            >
              <svg viewBox="0 0 24 24" className="size-4 shrink-0 max-sm:hidden" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d={item.icon} strokeLinejoin="round" strokeLinecap="round" />
              </svg>
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction} className="lg:hidden">
          <button type="submit" className="rounded-lg px-2 py-2 text-sm text-muted hover:text-fg">
            Выйти
          </button>
        </form>
      </div>
      <div className="hidden px-5 pb-6 lg:absolute lg:bottom-0 lg:block lg:w-60">
        <a href="/" target="_blank" className="block rounded-lg px-3 py-2 text-sm text-muted hover:text-fg">
          Открыть сайт ↗
        </a>
        <form action={logoutAction}>
          <button type="submit" className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted hover:text-fg">
            Выйти
          </button>
        </form>
      </div>
    </aside>
  );
}
