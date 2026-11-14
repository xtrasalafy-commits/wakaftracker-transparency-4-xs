"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Receipt, Wallet } from "lucide-react";

export interface FinancialLogData {
  id: string;
  title: string;
  category: string;
  amount: string;
  expenseDate: string;
  receiptUrl: string | null;
}

export interface TransactionData {
  id: string;
  donorName: string;
  amount: string;
  isAnonymous: boolean;
  createdAt: string;
}

function monthKey(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [y, m] = key.split("-");
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("id-ID", { month: "short", year: "2-digit" });
}

export function CashFlowPanel({ logs, transactions }: { logs: FinancialLogData[]; transactions: TransactionData[] }) {
  const months = new Set<string>();
  const income: Record<string, number> = {};
  const expense: Record<string, number> = {};

  transactions.forEach((t) => {
    const key = monthKey(t.createdAt);
    months.add(key);
    income[key] = (income[key] ?? 0) + Number(t.amount);
  });

  logs.forEach((l) => {
    const key = monthKey(l.expenseDate);
    months.add(key);
    expense[key] = (expense[key] ?? 0) + Number(l.amount);
  });

  const chartData = Array.from(months)
    .sort()
    .map((key) => ({
      month: monthLabel(key),
      Pemasukan: income[key] ?? 0,
      Pengeluaran: expense[key] ?? 0,
    }));

  const totalIncome = transactions.reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = logs.reduce((s, l) => s + Number(l.amount), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-emerald-50 p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase text-emerald-700">
            <Wallet className="h-3.5 w-3.5" /> Total Pemasukan
          </p>
          <p className="mt-1 text-lg font-bold text-emerald-800">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="rounded-xl bg-amber-50 p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase text-amber-700">
            <Receipt className="h-3.5 w-3.5" /> Total Pengeluaran
          </p>
          <p className="mt-1 text-lg font-bold text-amber-800">{formatCurrency(totalExpense)}</p>
        </div>
        <div className="rounded-xl bg-slate-100 p-4">
          <p className="text-xs font-semibold uppercase text-slate-600">Saldo Dana</p>
          <p className="mt-1 text-lg font-bold text-slate-800">{formatCurrency(totalIncome - totalExpense)}</p>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis
                fontSize={12}
                tickFormatter={(v) => `${Math.round(Number(v) / 1_000_000)}jt`}
                width={48}
              />
              <Tooltip formatter={(v) => formatCurrency(Number(v ?? 0))} />
              <Legend />
              <Bar dataKey="Pemasukan" fill="#059669" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Pengeluaran" fill="#d97706" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div>
        <h4 className="mb-3 text-sm font-semibold text-slate-700">Rincian Log Pengeluaran</h4>
        {logs.length === 0 ? (
          <p className="text-sm text-slate-500">Belum ada catatan pengeluaran.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-2">Tanggal</th>
                  <th className="px-4 py-2">Keterangan</th>
                  <th className="px-4 py-2">Kategori</th>
                  <th className="px-4 py-2 text-right">Nominal</th>
                  <th className="px-4 py-2">Bukti</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="whitespace-nowrap px-4 py-2 text-slate-500">{formatDate(log.expenseDate)}</td>
                    <td className="px-4 py-2 font-medium text-slate-800">{log.title}</td>
                    <td className="px-4 py-2 text-slate-500">{log.category}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-right font-semibold text-slate-800">
                      {formatCurrency(log.amount)}
                    </td>
                    <td className="px-4 py-2">
                      {log.receiptUrl ? (
                        <a
                          href={log.receiptUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 underline hover:text-emerald-800"
                        >
                          Lihat Nota
                        </a>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
