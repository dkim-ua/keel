/** Keel mark: a "K" whose stem continues below the line as a keel — the part that keeps the course. */
export function LogoMark({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none">
      <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="8" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1.5" />
      <path d="M11 6.5v13" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M21.5 6.5L11.8 14.5l9.7 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 19.5v6" stroke="var(--color-accent)" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 text-fg ${className}`}>
      <LogoMark />
      <span className="text-[1.05rem] font-semibold tracking-[-0.02em]">Keel</span>
    </span>
  );
}
