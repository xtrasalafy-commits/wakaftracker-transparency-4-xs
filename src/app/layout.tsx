import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "WakafTracker — Dashboard Transparansi & Laporan Proyek Wakaf",
  description:
    "Platform transparansi wakaf untuk Nazhir dan Wakif: pantau pendanaan, progres fisik, arus kas, dan e-sertifikat wakaf secara real-time.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
