import type { ReactNode } from "react";
import type { ServiceIcon as ServiceIconName } from "@/content/services";

const paths: Record<ServiceIconName, ReactNode> = {
  web: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <path d="M3 9h18" />
      <path d="M6.5 6.75h.01M9 6.75h.01" />
      <path d="M8 13.5l-2 1.75L8 17M16 13.5l2 1.75L16 17M13 12.5l-2 6" />
    </>
  ),
  mobile: (
    <>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <path d="M10.5 18.5h3" />
      <path d="M9.5 7.5h5M9.5 10.5h5M9.5 13.5h3" />
    </>
  ),
  custom: (
    <>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
      <path d="M17.25 13.5v7.5M13.5 17.25H21" />
    </>
  ),
  ai: (
    <>
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
      <path d="M18.5 15l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8zM6 16l.5 1.5L8 18l-1.5.5L6 20l-.5-1.5L4 18l1.5-.5L6 16z" />
    </>
  ),
  automation: (
    <>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M8.5 6H14a3 3 0 013 3v0a3 3 0 01-3 3h-4a3 3 0 00-3 3v0a3 3 0 003 3h5.5" />
      <path d="M13.5 15.5L15.5 18l-2 2.5" />
    </>
  ),
  mvp: (
    <>
      <path d="M12 21c-1.5-2-2.5-4.5-2.5-7.5C9.5 8 12 4 12 3c0 1 2.5 5 2.5 10.5 0 3-1 5.5-2.5 7.5z" />
      <path d="M9.5 14l-3 2.5V20l3-1.5M14.5 14l3 2.5V20l-3-1.5" />
      <circle cx="12" cy="10.5" r="1.25" />
    </>
  ),
};

export function ServiceIcon({ name, className = "size-6" }: { name: ServiceIconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export function CheckIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
