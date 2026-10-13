/**
 * Abstract product-system diagram for the hero.
 * Pure SVG + CSS animation (stroke-dashoffset) — no JS, no images, tiny payload.
 */

type Node = { id: string; x: number; y: number; label: string; sub: string; accent?: boolean };

const W = 128;
const H = 46;

const nodes: Node[] = [
  { id: "web", x: 24, y: 40, label: "web app", sub: "next.js · react" },
  { id: "mobile", x: 24, y: 130, label: "mobile app", sub: "ios · android" },
  { id: "jobs", x: 24, y: 220, label: "jobs", sub: "queue · cron" },
  { id: "api", x: 216, y: 85, label: "api", sub: "gateway · auth", accent: true },
  { id: "db", x: 216, y: 210, label: "database", sub: "postgresql" },
  { id: "services", x: 408, y: 40, label: "services", sub: "domain logic" },
  { id: "ai", x: 408, y: 130, label: "ai layer", sub: "llm · retrieval" },
  { id: "integrations", x: 408, y: 220, label: "integrations", sub: "crm · payments" },
];

const edges = [
  "M152 63 C184 63 184 108 216 108",
  "M152 153 C184 153 184 108 216 108",
  "M152 243 C184 243 184 233 216 233",
  "M344 108 C376 108 376 63 408 63",
  "M344 108 C376 108 376 153 408 153",
  "M280 131 V210",
  "M344 233 C376 233 376 243 408 243",
  "M472 176 V220",
];

const pipeline = ["discovery", "build", "qa", "launch"];

export function ArchitectureVisual({ label }: { label: string }) {
  return (
    <figure className="relative">
      <div className="pointer-events-none absolute -inset-10 rounded-[3rem] bg-[radial-gradient(closest-side,rgba(143,180,255,0.16),transparent)] blur-2xl" />
      <div className="card glass relative overflow-hidden p-2 sm:p-3">
        <div className="flex items-center justify-between px-3 pb-2 pt-1.5 font-mono text-[0.68rem] tracking-wider text-subtle">
          <span>product-system</span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 animate-pulse-soft rounded-full bg-signal" />
            production
          </span>
        </div>
        <svg
          viewBox="0 0 560 410"
          role="img"
          aria-label={label}
          className="block h-auto w-full rounded-xl border border-line bg-bg/60 font-mono"
        >
          <defs>
            <pattern id="ng-dots" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.8" fill="#253042" />
            </pattern>
            <linearGradient id="ng-node" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#111722" />
              <stop offset="1" stopColor="#0b0f16" />
            </linearGradient>
            <linearGradient id="ng-accent" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#1a2840" />
              <stop offset="1" stopColor="#0f1626" />
            </linearGradient>
          </defs>

          <rect width="560" height="410" fill="url(#ng-dots)" />

          {/* connections */}
          <g fill="none" strokeLinecap="round">
            {edges.map((d) => (
              <path key={`base-${d}`} d={d} stroke="#253042" strokeWidth="1.25" />
            ))}
            {edges.map((d, i) => (
              <path
                key={`flow-${d}`}
                d={d}
                stroke="#8fb4ff"
                strokeOpacity="0.85"
                strokeWidth="1.25"
                strokeDasharray="3 25"
                className="animate-flow"
                style={{ animationDelay: `${i * -0.35}s` }}
              />
            ))}
          </g>

          {/* nodes */}
          {nodes.map((n) => (
            <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
              <rect
                width={W}
                height={H}
                rx="10"
                fill={n.accent ? "url(#ng-accent)" : "url(#ng-node)"}
                stroke={n.accent ? "#8fb4ff" : "#253042"}
                strokeOpacity={n.accent ? 0.7 : 1}
              />
              <circle cx="14" cy="16" r="2.5" fill={n.accent ? "#8fb4ff" : "#7fdcc0"} opacity={n.accent ? 1 : 0.8} />
              <text x="24" y="19.5" fill="#edf1f7" fontSize="11.5" letterSpacing="0.02em">
                {n.label}
              </text>
              <text x="14" y="35" fill="#657083" fontSize="9.5" letterSpacing="0.03em">
                {n.sub}
              </text>
            </g>
          ))}

          {/* release pipeline */}
          <g transform="translate(24 300)">
            <rect width="512" height="86" rx="12" fill="#0a0e15" stroke="#18202b" />
            <text x="16" y="24" fill="#657083" fontSize="9.5" letterSpacing="0.12em">
              RELEASE PIPELINE
            </text>
            <line x1="56" x2="456" y1="54" y2="54" stroke="#253042" strokeWidth="1.25" />
            <line x1="56" x2="456" y1="54" y2="54" stroke="#8fb4ff" strokeWidth="1.25" strokeDasharray="3 25" className="animate-flow" />
            {pipeline.map((step, i) => {
              const cx = 56 + i * (400 / 3);
              const last = i === pipeline.length - 1;
              return (
                <g key={step} transform={`translate(${cx} 54)`}>
                  <circle r="9" fill="#0a0e15" stroke={last ? "#8fb4ff" : "#7fdcc0"} strokeOpacity={last ? 0.9 : 0.7} />
                  {last ? (
                    <circle r="3.5" fill="#8fb4ff" className="animate-pulse-soft" />
                  ) : (
                    <path d="M-3.5 0.5l2.3 2.3L3.8-2.6" fill="none" stroke="#7fdcc0" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  )}
                  <text y="26" textAnchor="middle" fill={last ? "#edf1f7" : "#98a3b3"} fontSize="10" letterSpacing="0.04em">
                    {step}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </figure>
  );
}
