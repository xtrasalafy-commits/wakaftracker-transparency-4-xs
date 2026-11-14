import { listProjects, getAdminStats } from "@/lib/queries";
import { ProjectCatalog } from "@/components/project-catalog";
import { formatCurrency } from "@/lib/utils";
import { ShieldCheck, TrendingUp, Users, Wallet } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [projects, stats] = await Promise.all([listProjects(), getAdminStats()]);

  return (
    <main>
      <section className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            <ShieldCheck className="h-4 w-4" /> Transparan &amp; Akuntabel
          </p>
          <h1 className="max-w-2xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Pantau Setiap Rupiah Wakaf Anda, dari Dana hingga Progres Fisik.
          </h1>
          <p className="mt-4 max-w-xl text-base text-emerald-50/90">
            WakafTracker membantu Nazhir melaporkan penggunaan dana secara transparan dan
            membantu Wakif melihat langsung dampak nyata dari wakaf yang telah ditunaikan.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatPill icon={<Wallet className="h-5 w-5" />} label="Dana Terkumpul" value={formatCurrency(stats.totalCollected)} />
            <StatPill icon={<TrendingUp className="h-5 w-5" />} label="Proyek Berjalan" value={String(stats.ongoingProjects)} />
            <StatPill icon={<Users className="h-5 w-5" />} label="Total Wakif" value={String(stats.totalDonors)} />
            <StatPill icon={<ShieldCheck className="h-5 w-5" />} label="Total Transaksi" value={String(stats.totalTransactions)} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-slate-900">Katalog Proyek Wakaf</h2>
          <p className="text-sm text-slate-500">
            Pilih proyek, pantau progres pendanaan dan progres fisiknya secara real-time.
          </p>
        </div>
        <ProjectCatalog
          projects={projects.map((p) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            category: p.category,
            location: p.location,
            status: p.status,
            targetAmount: p.targetAmount,
            collectedAmount: p.collectedAmount,
            physicalProgress: p.physicalProgress,
            coverImageUrl: p.coverImageUrl,
          }))}
        />
      </section>
    </main>
  );
}

function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
      <div className="mb-2 flex items-center gap-2 text-emerald-100">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-lg font-bold sm:text-xl">{value}</p>
    </div>
  );
}
