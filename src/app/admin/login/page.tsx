import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/ui/Logo";
import { adminConfigured, isAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Вход" };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-between">
          <Logo />
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">Admin</span>
        </div>
        {adminConfigured() ? (
          <LoginForm />
        ) : (
          <div className="card p-6 text-sm leading-relaxed text-muted">
            <p className="font-medium text-fg">Пароль администратора не задан.</p>
            <p className="mt-2">
              Добавьте переменную <code className="text-fg">ADMIN_PASSWORD</code> в Vercel → Settings → Environment Variables (или в{" "}
              <code className="text-fg">.env.local</code> локально) и перезапустите сайт.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
