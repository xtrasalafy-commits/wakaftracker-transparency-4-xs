"use client";

import { useState } from "react";
import { CheckCircle2, Circle, CircleDot } from "lucide-react";
import { MilestoneStatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/utils";

export interface MilestoneData {
  id: string;
  title: string;
  description: string | null;
  status: string;
  targetCompletionDate: string | null;
}

export function MilestoneTimeline({ milestones }: { milestones: MilestoneData[] }) {
  const [expanded, setExpanded] = useState<string | null>(milestones[0]?.id ?? null);

  if (milestones.length === 0) {
    return <p className="text-sm text-slate-500">Belum ada tahapan milestone untuk proyek ini.</p>;
  }

  return (
    <ol className="relative ml-3 border-l-2 border-slate-200">
      {milestones.map((m) => {
        const isOpen = expanded === m.id;
        return (
          <li key={m.id} className="mb-2 ml-6">
            <span className="absolute -left-[11px] flex h-5 w-5 items-center justify-center rounded-full bg-white">
              {m.status === "COMPLETED" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              ) : m.status === "IN_PROGRESS" ? (
                <CircleDot className="h-5 w-5 text-amber-500" />
              ) : (
                <Circle className="h-5 w-5 text-slate-300" />
              )}
            </span>
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : m.id)}
              className="flex w-full items-center justify-between gap-3 rounded-xl p-3 text-left hover:bg-slate-50"
            >
              <div>
                <p className="font-semibold text-slate-900">{m.title}</p>
                <p className="text-xs text-slate-500">Target: {formatDate(m.targetCompletionDate)}</p>
              </div>
              <MilestoneStatusBadge status={m.status} />
            </button>
            {isOpen && m.description && (
              <p className="ml-3 mt-1 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">{m.description}</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
