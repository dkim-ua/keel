"use client";

import { useActionState } from "react";
import { loginAction, type FormState } from "@/app/admin/actions";
import { buttonClasses } from "@/components/ui/Button";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(loginAction, undefined);

  return (
    <form action={action} className="card space-y-5 p-6">
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-fg">
          Пароль
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className="block w-full rounded-xl border border-line bg-bg/70 px-4 py-3 text-fg focus:border-accent/70 focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>
      {state?.error && (
        <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/[0.06] px-4 py-3 text-sm text-red-200">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className={buttonClasses("primary", "lg", "w-full")}>
        {pending ? "Входим…" : "Войти"}
      </button>
    </form>
  );
}
