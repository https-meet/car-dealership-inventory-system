import { Trophy } from "lucide-react";
import type { TopSellingEntry } from "../../types/report";

interface Props {
  entries: TopSellingEntry[];
}

const rankColors = [
  "bg-amber-400 text-white",   // 1st — gold
  "bg-slate-400 text-white",   // 2nd — silver
  "bg-orange-400 text-white",  // 3rd — bronze
];

export default function TopSellingTable({ entries }: Props) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-10 text-slate-400">
        <Trophy size={28} className="mb-2 opacity-30" />
        <p className="text-sm">No sales data available yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-5 py-3">Rank</th>
            <th className="px-5 py-3">Vehicle</th>
            <th className="px-5 py-3">Category</th>
            <th className="px-5 py-3">Unit Price</th>
            <th className="px-5 py-3">Units Sold</th>
            <th className="px-5 py-3">Total Revenue</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {entries.map((entry, idx) => {
            const v = entry.vehicle;
            const revenue = v ? Number(v.price) * entry.totalSold : 0;
            const rankClass =
              rankColors[idx] ?? "bg-slate-100 text-slate-600";

            return (
              <tr
                key={v?.id ?? idx}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${rankClass}`}
                  >
                    {idx + 1}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {v ? (
                    <div>
                      <p className="font-medium text-slate-800">
                        {v.make} {v.model}
                      </p>
                    </div>
                  ) : (
                    <span className="text-xs italic text-slate-400">
                      Unknown
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-slate-600">
                  {v
                    ? v.category.charAt(0) + v.category.slice(1).toLowerCase()
                    : "—"}
                </td>
                <td className="px-5 py-4 text-slate-700">
                  {v ? `₹${Number(v.price).toLocaleString("en-IN")}` : "—"}
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {entry.totalSold} units
                  </span>
                </td>
                <td className="px-5 py-4 font-semibold text-emerald-700">
                  {revenue > 0
                    ? `₹${revenue.toLocaleString("en-IN")}`
                    : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
