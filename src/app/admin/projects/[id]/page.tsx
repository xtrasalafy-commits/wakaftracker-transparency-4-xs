import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectDetail } from "@/lib/queries";
import { ProjectAdminTabs } from "@/components/admin/project-admin-tabs";
import { ProjectStatusBadge } from "@/components/status-badge";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getProjectDetail(id);
  if (!detail) notFound();

  const { project, milestones, financialLogs, progressUpdates } = detail;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/projects" className="mb-3 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-emerald-700">
          <ArrowLeft className="h-4 w-4" /> Kembali ke daftar proyek
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-bold text-slate-900">{project.title}</h2>
          <ProjectStatusBadge status={project.status} />
        </div>
      </div>

      <ProjectAdminTabs
        projectId={project.id}
        projectForm={{
          id: project.id,
          title: project.title,
          category: project.category,
          targetAmount: project.targetAmount,
          location: project.location,
          description: project.description,
          status: project.status,
          coverImageUrl: project.coverImageUrl ?? "",
          physicalProgress: project.physicalProgress,
        }}
        milestones={milestones.map((m) => ({
          id: m.id,
          title: m.title,
          description: m.description,
          status: m.status,
          orderIndex: m.orderIndex,
          targetCompletionDate: m.targetCompletionDate,
        }))}
        financialLogs={financialLogs.map((l) => ({
          id: l.id,
          title: l.title,
          category: l.category,
          amount: l.amount,
          expenseDate: l.expenseDate,
          receiptUrl: l.receiptUrl,
        }))}
        progressUpdates={progressUpdates.map((u) => ({
          id: u.id,
          title: u.title,
          description: u.description,
          imageUrls: u.imageUrls,
          notifiedAt: u.notifiedAt ? u.notifiedAt.toString() : null,
          createdAt: u.createdAt.toString(),
        }))}
      />
    </div>
  );
}
