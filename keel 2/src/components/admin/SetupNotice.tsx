/** Shown at the top of the admin panel until storage is connected. */
export function SetupNotice({ storage, blob }: { storage: boolean; blob: boolean }) {
  if (storage && blob) return null;
  return (
    <div className="mb-8 space-y-3">
      {!storage && (
        <div className="rounded-2xl border border-amber-300/30 bg-amber-300/[0.06] p-5 text-sm leading-relaxed text-amber-100">
          <p className="font-medium">База данных не подключена — статистика, заявки и редактирование кейсов недоступны.</p>
          <p className="mt-1.5 text-amber-100/80">
            Vercel → проект → <b>Storage</b> → <b>Create Database</b> → <b>Upstash for Redis</b> (бесплатный план) → подключить к
            проекту → <b>Redeploy</b>. Переменные <code>KV_REST_API_URL</code> и <code>KV_REST_API_TOKEN</code> добавятся сами.
          </p>
        </div>
      )}
      {!blob && (
        <div className="rounded-2xl border border-line bg-surface p-5 text-sm leading-relaxed text-muted">
          <p className="font-medium text-fg">Хранилище картинок не подключено — загрузка скриншотов в кейсы недоступна.</p>
          <p className="mt-1.5">
            Vercel → <b>Storage</b> → <b>Create</b> → <b>Blob</b> (доступ <b>Public</b>) → подключить к проекту → <b>Redeploy</b>.
          </p>
        </div>
      )}
    </div>
  );
}
