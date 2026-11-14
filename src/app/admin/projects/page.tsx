import Link from "next/link";
import { listProjects } from "@/lib/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectStatusBadge } from "@/components/status-badge";
import { formatCurrency } from "@/lib/utils";
import { PlusCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await listProjects();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Semua Proyek</h2>
        <Link href="/admin/projects/new">
          <Button>
            <PlusCircle className="h-4 w-4" /> Proyek Baru
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Proyek</th>
                <th className="px-5 py-3">Kategori</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Terkumpul</th>
                <th className="px-5 py-3 text-right">Target</th>
                <th className="px-5 py-3 text-right">Progres Fisik</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <Link href={`/admin/projects/${p.id}`} className="font-semibold text-slate-800 hover:text-emerald-700">
                      {p.title}
                    </Link>
                    <p className="text-xs text-slate-400">{p.location}</p>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{p.category}</td>
                  <td className="px-5 py-3">
                    <ProjectStatusBadge status={p.status} />
                  </td>
                  <td className="px-5 py-3 text-right font-medium text-emerald-700">{formatCurrency(p.collectedAmount)}</td>
                  <td className="px-5 py-3 text-right text-slate-600">{formatCurrency(p.targetAmount)}</td>
                  <td className="px-5 py-3 text-right text-slate-600">{p.physicalProgress}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
