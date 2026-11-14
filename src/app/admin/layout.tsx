import type { ReactNode } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { AdminLogin } from "@/components/admin/admin-login";
import { LogoutButton } from "@/components/logout-button";
import { LayoutDashboard, FolderKanban } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN_NAZHIR") {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <AdminLogin />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Dashboard Nazhir</p>
          <h1 className="text-2xl font-bold text-slate-900">Halo, {user.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 text-sm font-medium">
            <Link href="/admin" className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100">
              <LayoutDashboard className="h-4 w-4" /> Ringkasan
            </Link>
            <Link href="/admin/projects" className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100">
              <FolderKanban className="h-4 w-4" /> Proyek
            </Link>
          </nav>
          <LogoutButton />
        </div>
      </div>
      {children}
    </main>
  );
}
