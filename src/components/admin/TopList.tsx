/** Ranked list with proportional bars (top pages, sources, countries…). */
export function TopList({ title, items, empty = "Нет данных" }: { title: string; items: { name: string; count: number }[]; empty?: string }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  const total = items.reduce((s, i) => s + i.count, 0);
  return (
    <div className="card p-5">
      <h2 className="mb-3 text-sm font-medium text-fg">{title}</h2>
      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-subtle">{empty}</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((item) => (
            <li key={item.name} className="relative flex items-center justify-between gap-3 overflow-hidden rounded-md px-2.5 py-1.5 text-sm">
              <span aria-hidden="true" className="absolute inset-y-0 left-0 rounded-md bg-accent/[0.09]" style={{ width: `${(item.count / max) * 100}%` }} />
              <span className="relative truncate text-fg/90" title={item.name}>
                {item.name}
              </span>
              <span className="relative shrink-0 font-mono text-xs tabular-nums text-muted">
                {item.count.toLocaleString("ru-RU")}
                <span className="ml-2 text-subtle">{Math.round((item.count / total) * 100)}%</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
