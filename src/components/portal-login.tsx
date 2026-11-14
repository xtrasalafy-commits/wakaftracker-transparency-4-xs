"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";

const DEMO_ACCOUNTS = [
  { email: "budi@wakaftracker.id", name: "Budi Santoso" },
  { email: "siti@wakaftracker.id", name: "Siti Rahma" },
  { email: "anon@wakaftracker.id", name: "Hamba Allah" },
];

export function PortalLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function login(targetEmail: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await login(email);
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="mb-1 text-xl font-bold text-slate-900">Masuk Portal Wakif</h2>
      <p className="mb-6 text-sm text-slate-500">
        Masukkan email yang Anda gunakan saat berwakaf untuk melihat riwayat dan e-sertifikat Anda.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" required />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          <LogIn className="h-4 w-4" /> Masuk
        </Button>
      </form>

      <div className="mt-6 border-t border-slate-100 pt-4">
        <p className="mb-2 text-xs font-semibold uppercase text-slate-400">Akun Demo</p>
        <div className="flex flex-wrap gap-2">
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.email}
              type="button"
              onClick={() => login(acc.email)}
              className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              {acc.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
