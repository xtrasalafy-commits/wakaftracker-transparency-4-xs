import { formatCurrency, percentage } from "@/lib/utils";

interface DualProgressProps {
  collected: string | number;
  target: string | number;
  physicalProgress: number;
  compact?: boolean;
}

export function DualProgress({ collected, target, physicalProgress, compact }: DualProgressProps) {
  const fundingPct = percentage(collected, target);

  return (
    <div className="space-y-3">
      <div>
        <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-600">
          <span>Pendanaan</span>
          <span className="font-semibold text-emerald-700">{fundingPct}%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all"
            style={{ width: `${fundingPct}%` }}
          />
        </div>
        {!compact && (
          <p className="mt-1 text-xs text-slate-500">
            {formatCurrency(collected)} <span className="text-slate-400">dari</span> {formatCurrency(target)}
          </p>
        )}
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-600">
          <span>Progres Fisik</span>
          <span className="font-semibold text-amber-700">{physicalProgress}%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all"
            style={{ width: `${physicalProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
