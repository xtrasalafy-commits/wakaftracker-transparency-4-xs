import { Badge } from "@/components/ui/badge";

const PROJECT_STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "warning" }> = {
  DRAFT: { label: "Draft", variant: "secondary" },
  ONGOING: { label: "Berjalan", variant: "warning" },
  COMPLETED: { label: "Selesai", variant: "default" },
};

const MILESTONE_STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "warning" | "info" }> = {
  PENDING: { label: "Menunggu", variant: "secondary" },
  IN_PROGRESS: { label: "Dikerjakan", variant: "info" },
  COMPLETED: { label: "Selesai", variant: "default" },
};

export function ProjectStatusBadge({ status }: { status: string }) {
  const meta = PROJECT_STATUS_MAP[status] ?? { label: status, variant: "secondary" as const };
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}

export function MilestoneStatusBadge({ status }: { status: string }) {
  const meta = MILESTONE_STATUS_MAP[status] ?? { label: status, variant: "secondary" as const };
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}
