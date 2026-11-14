"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState<string | null>(null);

  if (images.length === 0) return null;

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {images.map((img, idx) => (
          <button
            key={`${img}-${idx}`}
            type="button"
            onClick={() => setActive(img)}
            className="aspect-square overflow-hidden rounded-xl bg-slate-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={`${title} - foto ${idx + 1}`} className="h-full w-full object-cover transition hover:scale-105" />
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setActive(null)}
          >
            <X className="h-5 w-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={active} alt={title} className="max-h-[85vh] max-w-full rounded-xl object-contain" />
        </div>
      )}
    </div>
  );
}
