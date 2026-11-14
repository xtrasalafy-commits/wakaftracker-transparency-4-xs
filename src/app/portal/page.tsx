import { getCurrentUser } from "@/lib/auth";
import { listTransactionsByUserEmail, listProgressUpdatesForProjects } from "@/lib/queries";
import { PortalLogin } from "@/components/portal-login";
import { LogoutButton } from "@/components/logout-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Award, FileText, Printer } from "lucide-react";
import Link from "next/link";
import { ProgressFeed } from "@/components/progress-feed";

export const dynamic = "force-dynamic";

export default async function PortalPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <PortalLogin />
      </main>
    );
  }

  const rows = await listTransactionsByUserEmail(user.email);
  const projectIds = Array.from(new Set(rows.map((r) => r.project.id)));
  const updateRows = await listProgressUpdatesForProjects(projectIds);

  const totalDonated = rows.reduce((sum, r) => sum + Number(r.transaction.amount), 0);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Portal Wakif</h1>
          <p className="text-sm text-slate-500">Selamat datang, {user.name}.</p>
        </div>
        <LogoutButton />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs font-semibold uppercase text-slate-400">Total Wakaf</p>
            <p className="mt-1 text-xl font-bold text-emerald-700">{formatCurrency(totalDonated)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs font-semibold uppercase text-slate-400">Jumlah Transaksi</p>
            <p className="mt-1 text-xl font-bold text-slate-800">{rows.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs font-semibold uppercase text-slate-400">Proyek Didukung</p>
            <p className="mt-1 text-xl font-bold text-slate-800">{projectIds.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-700" /> Riwayat Wakaf
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rows.length === 0 ? (
                <p className="text-sm text-slate-500">Belum ada riwayat wakaf.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {rows.map(({ transaction, project }) => (
                    <div key={transaction.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                      <div>
                        <Link href={`/projects/${project.slug}`} className="font-medium text-slate-800 hover:text-emerald-700">
                          {project.title}
                        </Link>
                        <p className="text-xs text-slate-400">{formatDateTime(transaction.createdAt.toString())}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-emerald-700">{formatCurrency(transaction.amount)}</p>
                        <Link
                          href={`/certificate/${transaction.certificateCode}`}
                          className="text-xs font-medium text-slate-500 underline hover:text-emerald-700"
                        >
                          {transaction.certificateCode}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feed Update Progres Proyek Anda</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressFeed
                updates={updateRows.map(({ update }) => ({
                  id: update.id,
                  title: update.title,
                  description: update.description,
                  imageUrls: update.imageUrls,
                  notifiedAt: update.notifiedAt ? update.notifiedAt.toString() : null,
                  createdAt: update.createdAt.toString(),
                }))}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-600" /> Galeri e-Sertifikat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {rows.length === 0 ? (
                <p className="text-sm text-slate-500">Belum ada sertifikat.</p>
              ) : (
                rows.map(({ transaction, project }) => (
                  <Link
                    key={transaction.id}
                    href={`/certificate/${transaction.certificateCode}`}
                    className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 hover:bg-amber-100"
                  >
                    <div>
                      <p className="text-sm font-semibold text-amber-900">{project.title}</p>
                      <Badge variant="warning" className="mt-1">{transaction.certificateCode}</Badge>
                    </div>
                    <Printer className="h-4 w-4 text-amber-700" />
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
