"use client";

import { useTransition } from "react";
import { importStaticCasesAction } from "@/app/admin/actions";
import { buttonClasses } from "@/components/ui/Button";

export function ImportCasesButton() {
  const [pending, start] = useTransition();
  return (
    <button type="button" disabled={pending} onClick={() => start(() => importStaticCasesAction())} className={buttonClasses("secondary", "md")}>
      {pending ? "Импортируем…" : "Импортировать концепт-кейсы"}
    </button>
  );
}
