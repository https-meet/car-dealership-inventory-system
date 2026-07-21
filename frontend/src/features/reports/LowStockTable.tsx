import { AlertTriangle } from "lucide-react";
import type { LowStockVehicle } from "../../types/report";
import { formatCurrency, titleCase } from "../../utils/format";

interface Props {
  vehicles: LowStockVehicle[];
}

function stockColor(qty: number) {
  if (qty === 0) return "bg-rose-50 text-rose-700 ring-rose-100";
  if (qty <= 2) return "bg-orange-50 text-orange-700 ring-orange-100";
  return "bg-amber-50 text-amber-700 ring-amber-100";
}

export default function LowStockTable({ vehicles }: Props) {
  if (vehicles.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-16 text-center border-dashed">
        <AlertTriangle size={30} className="mb-2 text-slate-300" />
        <p className="text-sm font-semibold text-slate-700">All vehicles are well stocked.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:hidden">
        {vehicles.map((v) => (
          <article key={v.id} className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-slate-950">
                  {v.make} {v.model}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  {titleCase(v.category)} - {formatCurrency(v.price)}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1 ${stockColor(v.quantity)}`}
              >
                <AlertTriangle size={13} />
                {v.quantity === 0 ? "Out" : `${v.quantity} left`}
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden md:block card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-5 py-3">Vehicle</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Qty Remaining</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vehicles.map((v) => (
                <tr key={v.id} className="transition hover:bg-slate-50/70">
                  <td className="px-5 py-4 font-bold text-slate-950">
                    {v.make} {v.model}
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-600">
                    {titleCase(v.category)}
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-950">
                    {formatCurrency(v.price)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1 ${stockColor(v.quantity)}`}
                    >
                      <AlertTriangle size={13} />
                      {v.quantity === 0 ? "Out of stock" : `${v.quantity} left`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
