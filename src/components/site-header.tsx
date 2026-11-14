import Link from "next/link";
import { HandCoins, LayoutDashboard, UserCircle } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-emerald-800">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-700 text-white">
            <HandCoins className="h-5 w-5" />
          </span>
          <span className="text-lg">WakafTracker</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link href="/" className="hover:text-emerald-700">
            Katalog Proyek
          </Link>
          <Link href="/portal" className="hover:text-emerald-700">
            Portal Wakif
          </Link>
          <Link href="/admin" className="hover:text-emerald-700">
            Dashboard Nazhir
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/portal"
            className="hidden items-center gap-1.5 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:flex"
          >
            <UserCircle className="h-4 w-4" /> Portal Wakif
          </Link>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Nazhir</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
