import { notFound } from "next/navigation";
import { getCertificateByCode } from "@/lib/queries";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PrintButton } from "@/components/print-button";
import { HandCoins } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CertificatePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const data = await getCertificateByCode(code);
  if (!data || !data.project) notFound();

  const { transaction, project } = data;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex justify-end print:hidden">
        <PrintButton />
      </div>

      <div className="relative overflow-hidden rounded-3xl border-4 border-double border-emerald-700 bg-white p-10 shadow-lg">
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
          <HandCoins className="absolute -right-10 -top-10 h-64 w-64" />
        </div>

        <div className="relative text-center">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-emerald-700">
            <HandCoins className="h-5 w-5" /> WakafTracker
          </p>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">Sertifikat Wakaf</h1>
          <p className="mt-2 text-sm text-slate-500">Diberikan kepada</p>
          <p className="mt-1 text-2xl font-bold text-emerald-800">
            {transaction.isAnonymous ? "Hamba Allah" : transaction.donorName}
          </p>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-slate-600">
            Atas partisipasinya menunaikan wakaf sebesar{" "}
            <span className="font-semibold text-slate-900">{formatCurrency(transaction.amount)}</span> untuk
            program <span className="font-semibold text-slate-900">&ldquo;{project.title}&rdquo;</span> yang
            diselenggarakan oleh Nazhir WakafTracker. Semoga menjadi amal jariyah yang terus mengalir
            pahalanya.
          </p>

          <div className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 text-left text-sm">
            <div>
              <p className="text-xs uppercase text-slate-400">Kode Sertifikat</p>
              <p className="font-mono font-semibold text-slate-800">{transaction.certificateCode}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-400">Tanggal Wakaf</p>
              <p className="font-semibold text-slate-800">{formatDate(transaction.createdAt.toString())}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-400">Lokasi Proyek</p>
              <p className="font-semibold text-slate-800">{project.location}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-400">Kategori</p>
              <p className="font-semibold text-slate-800">{project.category}</p>
            </div>
          </div>

          {transaction.message && (
            <p className="mx-auto mt-6 max-w-md text-sm italic text-slate-500">&ldquo;{transaction.message}&rdquo;</p>
          )}

          <div className="mt-10 flex items-center justify-center gap-10">
            <div className="text-center">
              <p className="mb-8 text-xs text-slate-400">Nazhir Penanggung Jawab</p>
              <p className="border-t border-slate-300 pt-1 text-sm font-semibold text-slate-700">WakafTracker</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
