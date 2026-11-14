export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-500 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} WakafTracker. Transparansi wakaf untuk kemaslahatan umat.</p>
          <p className="text-xs text-slate-400">
            Dibangun dengan Next.js, Drizzle ORM &amp; PostgreSQL (kompatibel Neon Serverless).
          </p>
          <p className="text-xs font-semibold text-slate-400">Open Source oleh MZF - 2026</p>
        </div>
      </div>
    </footer>
  );
}
