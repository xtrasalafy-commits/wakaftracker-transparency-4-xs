import Link from "next/link";
import { MapPin } from "lucide-react";
import { DualProgress } from "@/components/dual-progress";
import { ProjectStatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";

export interface ProjectCardData {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  status: string;
  targetAmount: string;
  collectedAmount: string;
  physicalProgress: number;
  coverImageUrl: string | null;
}

export function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div
        className="h-44 w-full bg-slate-200 bg-cover bg-center"
        style={{
          backgroundImage: project.coverImageUrl ? `url(${project.coverImageUrl})` : undefined,
        }}
      />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary">{project.category}</Badge>
          <ProjectStatusBadge status={project.status} />
        </div>
        <h3 className="line-clamp-2 text-base font-semibold text-slate-900 group-hover:text-emerald-700">
          {project.title}
        </h3>
        <p className="flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5" /> {project.location}
        </p>
        <div className="mt-auto pt-2">
          <DualProgress
            collected={project.collectedAmount}
            target={project.targetAmount}
            physicalProgress={project.physicalProgress}
            compact
          />
        </div>
      </div>
    </Link>
  );
}
