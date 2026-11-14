"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "nazhir@wakaftracker.id" }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error?.formErrors?.join(", ") ?? json.error ?? "Gagal masuk.");
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-emerald-700" />
      <h2 className="text-xl font-bold text-slate-900">Dashboard Nazhir</h2>
      <p className="mb-6 mt-1 text-sm text-slate-500">
        Khusus pengelola (Nazhir) untuk mengelola proyek, milestone, dan laporan keuangan.
      </p>
      <Button onClick={login} disabled={loading} className="w-full">
        Masuk sebagai Nazhir (Demo)
      </Button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
