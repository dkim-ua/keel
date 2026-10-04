"use client";

import Link from "next/link";
import { useTransition } from "react";
import { deleteCaseAction, moveCaseAction, togglePublishedAction } from "@/app/admin/actions";

const btn = "rounded-lg border border-line px-2.5 py-1.5 text-xs text-muted transition-colors hover:border-line-strong hover:text-fg disabled:opacity-40";

export function CaseRowActions({ id, slug, published, isFirst, isLast }: { id: string; slug: string; published: boolean; isFirst: boolean; isLast: boolean }) {
  const [pending, start] = useTransition();

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${pending ? "opacity-60" : ""}`}>
      <button type="button" className={btn} disabled={pending || isFirst} onClick={() => start(() => moveCaseAction(id, "up"))} aria-label="Выше">
        ↑
      </button>
      <button type="button" className={btn} disabled={pending || isLast} onClick={() => start(() => moveCaseAction(id, "down"))} aria-label="Ниже">
        ↓
      </button>
      <button type="button" className={btn} disabled={pending} onClick={() => start(() => togglePublishedAction(id))}>
        {published ? "Скрыть" : "Показать"}
      </button>
      <a href={`/en/work/${slug}`} target="_blank" className={btn}>
        Открыть ↗
      </a>
      <Link href={`/admin/cases/${encodeURIComponent(id)}`} className={`${btn} border-line-strong text-fg`}>
        Редактировать
      </Link>
      <button
        type="button"
        className={`${btn} hover:border-red-400/50 hover:text-red-300`}
        disabled={pending}
        onClick={() => {
          if (confirm("Удалить кейс вместе с картинками?")) start(() => deleteCaseAction(id));
        }}
      >
        Удалить
      </button>
    </div>
  );
}
