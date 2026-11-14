import Link from "next/link";
import { getAdminStats, listProjects } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DualProgress } from "@/components/dual-progress";
import { ProjectStatusBadge } from "@/components/status-badge";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight, FolderKanban, PlusCircle, TrendingUp, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [stats, projects] = await Promise.all([getAdminStats(), listProjects()]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<FolderKanban className="h-5 w-5" />} label="Total Proyek" value={String(stats.totalProjects)} hint={`${stats.ongoingProjects} sedang berjalan`} />
        <StatCard icon={<Wallet className="h-5 w-5" />} label="Dana Terkumpul" value={formatCurrency(stats.totalCollected)} hint={`Target ${formatCurrency(stats.totalTarget)}`} />
        <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Total Pengeluaran" value={formatCurrency(stats.totalExpense)} hint={`Saldo ${formatCurrency(stats.netBalance)}`} />
        <StatCard icon={<Users className="h-5 w-5" />} label="Total Wakif" value={String(stats.totalDonors)} hint={`${stats.totalTransactions} transaksi`} />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Manajemen Proyek</CardTitle>
            <p className="text-sm text-slate-500">Kelola proyek, milestone, arus kas, dan update progres.</p>
          </div>
          <Link href="/admin/projects/new">
            <Button>
              <PlusCircle className="h-4 w-4" /> Proyek Baru
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/admin/projects/${p.id}`}
                className="group rounded-xl border border-slate-200 p-4 hover:border-emerald-400 hover:shadow-sm"
              >
                <div className="mb-2 flex items-center justify-between">
                  <ProjectStatusBadge status={p.status} />
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-600" />
                </div>
                <h3 className="mb-2 line-clamp-1 font-semibold text-slate-900">{p.title}</h3>
                <DualProgress collected={p.collectedAmount} target={p.targetAmount} physicalProgress={p.physicalProgress} compact />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint: string }) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="mb-2 flex items-center gap-2 text-emerald-700">
          {icon}
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
        </div>
        <p className="text-xl font-bold text-slate-900">{value}</p>
        <p className="mt-1 text-xs text-slate-400">{hint}</p>
      </CardContent>
    </Card>
  );
}
