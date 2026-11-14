import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/queries";
import { DualProgress } from "@/components/dual-progress";
import { ProjectStatusBadge } from "@/components/status-badge";
import { MilestoneTimeline } from "@/components/milestone-timeline";
import { CashFlowPanel } from "@/components/cash-flow-panel";
import { DonationForm } from "@/components/donation-form";
import { ProjectGallery } from "@/components/project-gallery";
import { ProgressFeed } from "@/components/progress-feed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { MapPin, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getProjectBySlug(slug);
  if (!detail) notFound();

  const { project, milestones, financialLogs, progressUpdates, transactions } = detail;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div
        className="mb-6 h-56 w-full rounded-2xl bg-slate-200 bg-cover bg-center sm:h-80"
        style={{ backgroundImage: project.coverImageUrl ? `url(${project.coverImageUrl})` : undefined }}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <ProjectStatusBadge status={project.status} />
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">{project.category}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{project.title}</h1>
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="h-4 w-4" /> {project.location}
            </p>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-700">{project.description}</p>
          </div>

          {project.imageUrls && project.imageUrls.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Galeri Foto Proyek</CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectGallery images={project.imageUrls} title={project.title} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Timeline Milestone Fisik</CardTitle>
            </CardHeader>
            <CardContent>
              <MilestoneTimeline
                milestones={milestones.map((m) => ({
                  id: m.id,
                  title: m.title,
                  description: m.description,
                  status: m.status,
                  targetCompletionDate: m.targetCompletionDate,
                }))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update Progres Lapangan</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressFeed
                updates={progressUpdates.map((u) => ({
                  id: u.id,
                  title: u.title,
                  description: u.description,
                  imageUrls: u.imageUrls,
                  notifiedAt: u.notifiedAt ? u.notifiedAt.toString() : null,
                  createdAt: u.createdAt.toString(),
                }))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transparansi Arus Kas</CardTitle>
            </CardHeader>
            <CardContent>
              <CashFlowPanel
                logs={financialLogs.map((l) => ({
                  id: l.id,
                  title: l.title,
                  category: l.category,
                  amount: l.amount,
                  expenseDate: l.expenseDate ?? "",
                  receiptUrl: l.receiptUrl,
                }))}
                transactions={transactions.map((t) => ({
                  id: t.id,
                  donorName: t.donorName,
                  amount: t.amount,
                  isAnonymous: t.isAnonymous,
                  createdAt: t.createdAt.toString(),
                }))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-700" /> Wakif Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <p className="text-sm text-slate-500">Jadilah wakif pertama untuk proyek ini.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {transactions.slice(0, 8).map((t) => (
                    <li key={t.id} className="flex items-center justify-between py-2 text-sm">
                      <div>
                        <p className="font-medium text-slate-800">{t.isAnonymous ? "Hamba Allah" : t.donorName}</p>
                        <p className="text-xs text-slate-400">{formatDateTime(t.createdAt.toString())}</p>
                      </div>
                      <p className="font-semibold text-emerald-700">{formatCurrency(t.amount)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <Card>
              <CardContent className="pt-5">
                <DualProgress
                  collected={project.collectedAmount}
                  target={project.targetAmount}
                  physicalProgress={project.physicalProgress}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tunaikan Wakaf</CardTitle>
              </CardHeader>
              <CardContent>
                <DonationForm projectId={project.id} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
