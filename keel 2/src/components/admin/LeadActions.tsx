"use client";

import { useState, useTransition } from "react";
import { deleteLeadAction, saveLeadNoteAction, setLeadStatusAction } from "@/app/admin/actions";
import { statusLabels } from "@/lib/admin/labels";
import { leadStatuses, type LeadStatus } from "@/lib/db/lead-status";

export function LeadActions({ id, status, note }: { id: string; status: LeadStatus; note: string }) {
  const [pending, start] = useTransition();
  const [draft, setDraft] = useState(note);
  const [saved, setSaved] = useState(false);

  return (
    <div className={`flex w-full shrink-0 flex-col gap-3 lg:w-64 ${pending ? "opacity-60" : ""}`}>
      <label className="text-xs text-subtle">
        Статус
        <select
          value={status}
          disabled={pending}
          onChange={(e) => start(() => setLeadStatusAction(id, e.target.value))}
          className="mt-1 block w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-fg focus:border-accent/70 focus:outline-none"
        >
          {leadStatuses.map((s) => (
            <option key={s} value={s}>
              {statusLabels[s]}
            </option>
          ))}
        </select>
      </label>

      <label className="text-xs text-subtle">
        Заметка
        <textarea
          value={draft}
          rows={3}
          onChange={(e) => {
            setDraft(e.target.value);
            setSaved(false);
          }}
          onBlur={() => {
            if (draft !== note) start(async () => {
              await saveLeadNoteAction(id, draft);
              setSaved(true);
            });
          }}
          placeholder="Только для команды"
          className="mt-1 block w-full resize-y rounded-lg border border-line bg-bg px-3 py-2 text-sm text-fg focus:border-accent/70 focus:outline-none"
        />
        {saved && <span className="mt-1 block text-signal">Сохранено</span>}
      </label>

      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (confirm("Удалить заявку без возможности восстановления?")) start(() => deleteLeadAction(id));
        }}
        className="self-start text-xs text-subtle transition-colors hover:text-red-300"
      >
        Удалить заявку
      </button>
    </div>
  );
}
