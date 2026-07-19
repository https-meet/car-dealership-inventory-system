import { AlertTriangle } from "lucide-react";
import type { LowStockVehicle } from "../../types/report";
import { formatCurrency, titleCase } from "../../utils/format";

interface Props {
  vehicles: LowStockVehicle[];
}

function stockColor(qty: number) {
  if (qty === 0) return "text-red-600 bg-red-50";
  if (qty <= 2) return "text-red-500 bg-red-50";
  return "text-amber-600 bg-amber-50";
}

export default function LowStockTable({ vehicles }: Props) {
  if (vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-10 text-slate-400">
        <AlertTriangle size={28} className="mb-2 opacity-30" />
        <p className="text-sm">All vehicles are well stocked!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-5 py-3">Vehicle</th>
            <th className="px-5 py-3">Category</th>
            <th className="px-5 py-3">Price</th>
            <th className="px-5 py-3">Qty Remaining</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {vehicles.map((v) => (
            <tr key={v.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-5 py-4">
                <p className="font-medium text-slate-800">
                  {v.make} {v.model}
                </p>
              </td>
              <td className="px-5 py-4 text-slate-600">
                {titleCase(v.category)}
              </td>
              <td className="px-5 py-4 font-medium text-slate-700">
                {formatCurrency(v.price)}
              </td>
              <td className="px-5 py-4">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${stockColor(v.quantity)}`}
                >
                  <AlertTriangle size={12} />
                  {v.quantity === 0 ? "Out of Stock" : `${v.quantity} left`}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

