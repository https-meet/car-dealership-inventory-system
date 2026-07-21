import { Trophy } from "lucide-react";
import type { TopSellingEntry } from "../../types/report";
import { formatCurrency, titleCase } from "../../utils/format";

interface Props {
  entries: TopSellingEntry[];
}

const rankColors = [
  "bg-amber-500 text-white",
  "bg-slate-500 text-white",
  "bg-orange-500 text-white",
];

export default function TopSellingTable({ entries }: Props) {
  if (entries.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-16 text-center border-dashed">
        <Trophy size={30} className="mb-2 text-slate-300" />
        <p className="text-sm font-semibold text-slate-700">No sales data available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:hidden">
        {entries.map((entry, idx) => {
          const v = entry.vehicle;
          const revenue = v ? Number(v.price) * entry.totalSold : 0;
          const rankClass = rankColors[idx] ?? "bg-slate-100 text-slate-700";

          return (
            <article key={v?.id ?? idx} className="card p-4">
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${rankClass}`}
                >
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-slate-950">
                    {v ? `${v.make} ${v.model}` : "Unknown vehicle"}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {v ? titleCase(v.category) : "--"}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Units sold</p>
                  <p className="mt-1 text-sm font-bold text-slate-950">
                    {entry.totalSold}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Revenue</p>
                  <p className="mt-1 text-sm font-bold text-slate-950">
                    {revenue > 0 ? formatCurrency(revenue) : "--"}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="hidden md:block card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-5 py-3">Rank</th>
                <th className="px-5 py-3">Vehicle</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Unit Price</th>
                <th className="px-5 py-3">Units Sold</th>
                <th className="px-5 py-3">Total Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((entry, idx) => {
                const v = entry.vehicle;
                const revenue = v ? Number(v.price) * entry.totalSold : 0;
                const rankClass =
                  rankColors[idx] ?? "bg-slate-100 text-slate-700";

                return (
                  <tr key={v?.id ?? idx} className="transition hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${rankClass}`}
                      >
                        {idx + 1}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {v ? (
                        <p className="font-bold text-slate-950">
                          {v.make} {v.model}
                        </p>
                      ) : (
                        <span className="text-xs italic text-slate-400">
                          Unknown
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-600">
                      {v ? titleCase(v.category) : "--"}
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-600">
                      {v ? formatCurrency(v.price) : "--"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700 ring-1 ring-sky-100">
                        {entry.totalSold} units
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-950">
                      {revenue > 0 ? formatCurrency(revenue) : "--"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
