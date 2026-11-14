import { formatDateTime } from "@/lib/utils";
import { BellRing, ImageIcon } from "lucide-react";

export interface ProgressUpdateData {
  id: string;
  title: string;
  description: string;
  imageUrls: string[];
  notifiedAt: string | null;
  createdAt: string;
}

export function ProgressFeed({ updates }: { updates: ProgressUpdateData[] }) {
  if (updates.length === 0) {
    return <p className="text-sm text-slate-500">Belum ada update progres lapangan.</p>;
  }

  return (
    <div className="space-y-4">
      {updates.map((update) => (
        <div key={update.id} className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-semibold text-slate-900">{update.title}</h4>
            <span className="text-xs text-slate-400">{formatDateTime(update.createdAt)}</span>
          </div>
          <p className="text-sm text-slate-600">{update.description}</p>
          {update.imageUrls.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {update.imageUrls.map((img, idx) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${img}-${idx}`}
                  src={img}
                  alt={update.title}
                  className="aspect-square rounded-lg object-cover"
                />
              ))}
            </div>
          )}
          {update.imageUrls.length === 0 && (
            <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
              <ImageIcon className="h-3.5 w-3.5" /> Tidak ada foto bukti lapangan.
            </p>
          )}
          {update.notifiedAt && (
            <p className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-700">
              <BellRing className="h-3.5 w-3.5" /> Notifikasi terkirim ke wakif pada {formatDateTime(update.notifiedAt)}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
