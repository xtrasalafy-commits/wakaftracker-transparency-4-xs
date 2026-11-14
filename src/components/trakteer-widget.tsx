"use client";

import { useState } from "react";
import { Coffee, X, ExternalLink, QrCode, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const NOMINAL_OPTIONS = [6000, 12000, 18000, 25000, 50000, 100000];

export function TrakteerWidget() {
  const [open, setOpen] = useState(false);
  const [selectedNominal, setSelectedNominal] = useState(6000);

  const trakteerUrl = `https://trakteer.id/perpus_opera/tip?amount=${selectedNominal}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(trakteerUrl)}&size=250x250&format=png`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 shadow-lg"
      >
        <Coffee className="h-5 w-5" />
        <span>Kopi untuk Server</span>
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 rounded-full p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              aria-label="Tutup"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center mb-4">
              <Coffee className="mx-auto mb-2 h-8 w-8 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-lg">Web app ini gratis &amp; bebas iklan.</h3>
              <p className="text-sm text-slate-500 mt-1">Kopi kecil, server tetap jalan.</p>
            </div>

            <div className="space-y-3 mb-4">
              <p className="text-xs font-semibold uppercase text-slate-400">Pilih Nominal Traktiran</p>
              <div className="grid grid-cols-3 gap-2">
                {NOMINAL_OPTIONS.map((nominal) => (
                  <button
                    key={nominal}
                    onClick={() => setSelectedNominal(nominal)}
                    className={`rounded-lg border py-2 text-xs font-medium transition ${
                      selectedNominal === nominal
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Rp {nominal.toLocaleString("id-ID")}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 mb-4">
              <p className="text-xs font-semibold text-slate-600">Scan QR Code</p>
              <div className="rounded-lg border border-slate-100 p-2 bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrUrl} alt="QR Code Traktiran" className="rounded" />
              </div>
              <p className="text-xs text-slate-500 max-w-[240px] leading-tight">
                Scan atau klik tautan di bawah untuk memberikan traktiran melalui Trakteer.
              </p>
            </div>

            <Button
              className="w-full"
              variant="outline"
              onClick={() => window.open(trakteerUrl, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Buka di Trakteer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
