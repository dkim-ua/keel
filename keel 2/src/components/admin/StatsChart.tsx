import { formatDay } from "@/lib/admin/labels";

type Day = { day: string; views: number; visitors: number; leads: number };

/** Server-rendered SVG chart: views as bars, visitors as a line, leads as markers. */
export function StatsChart({ days }: { days: Day[] }) {
  if (days.length === 0) {
    return <div className="flex h-56 items-center justify-center text-sm text-subtle">Нет данных</div>;
  }

  const W = 1000;
  const H = 240;
  const pad = { top: 12, right: 8, bottom: 26, left: 36 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;
  const max = Math.max(4, ...days.map((d) => d.views));
  const niceMax = Math.ceil(max / 4) * 4;
  const step = innerW / days.length;
  const barW = Math.max(2, Math.min(28, step * 0.62));
  const x = (i: number) => pad.left + step * i + step / 2;
  const y = (v: number) => pad.top + innerH - (v / niceMax) * innerH;
  const labelEvery = Math.ceil(days.length / 10);

  const line = days.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d.visitors).toFixed(1)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Посещаемость по дням">
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <g key={f}>
          <line x1={pad.left} x2={W - pad.right} y1={y(niceMax * f)} y2={y(niceMax * f)} stroke="#18202b" />
          <text x={pad.left - 8} y={y(niceMax * f) + 4} textAnchor="end" fontSize="11" fill="#657083">
            {Math.round(niceMax * f)}
          </text>
        </g>
      ))}
      {days.map((d, i) => (
        <g key={d.day}>
          <title>{`${formatDay(d.day)}: ${d.views} просмотров, ${d.visitors} посетителей, ${d.leads} заявок`}</title>
          <rect x={x(i) - step / 2} y={pad.top} width={step} height={innerH} fill="transparent" />
          <rect x={x(i) - barW / 2} y={y(d.views)} width={barW} height={Math.max(0, y(0) - y(d.views))} rx={Math.min(3, barW / 3)} fill="#8fb4ff" fillOpacity="0.55" />
          {d.leads > 0 && (
            <path d={`M${x(i)},${y(d.views) - 14} l5,5 l-5,5 l-5,-5z`} fill="#fcd34d">
              <title>{`${d.leads} заявок`}</title>
            </path>
          )}
          {i % labelEvery === 0 && (
            <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="#657083">
              {formatDay(d.day)}
            </text>
          )}
        </g>
      ))}
      <path d={line} fill="none" stroke="#7fdcc0" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {days.length <= 31 &&
        days.map((d, i) => <circle key={`c-${d.day}`} cx={x(i)} cy={y(d.visitors)} r="2.5" fill="#7fdcc0" />)}
    </svg>
  );
}
