"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProjectForm, type ProjectFormValues } from "@/components/admin/project-form";
import { MilestoneManager, type MilestoneRow } from "@/components/admin/milestone-manager";
import { FinanceManager, type FinancialLogRow } from "@/components/admin/finance-manager";
import { ProgressManager } from "@/components/admin/progress-manager";
import type { ProgressUpdateData } from "@/components/progress-feed";

const TABS = [
  { key: "info", label: "Info Proyek" },
  { key: "milestones", label: "Milestone" },
  { key: "finance", label: "Arus Kas" },
  { key: "progress", label: "Progress Logger" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function ProjectAdminTabs({
  projectId,
  projectForm,
  milestones,
  financialLogs,
  progressUpdates,
}: {
  projectId: string;
  projectForm: ProjectFormValues;
  milestones: MilestoneRow[];
  financialLogs: FinancialLogRow[];
  progressUpdates: ProgressUpdateData[];
}) {
  const [tab, setTab] = useState<TabKey>("info");

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition",
              tab === t.key ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-100"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        {tab === "info" && <ProjectForm initial={projectForm} />}
        {tab === "milestones" && <MilestoneManager projectId={projectId} initial={milestones} />}
        {tab === "finance" && <FinanceManager projectId={projectId} initial={financialLogs} />}
        {tab === "progress" && (
          <ProgressManager
            projectId={projectId}
            milestoneOptions={milestones.map((m) => ({ id: m.id, title: m.title }))}
            initial={progressUpdates}
          />
        )}
      </div>
    </div>
  );
}
