import { Clock } from "lucide-react";
import type { RecentPurchase } from "../../types/report";
import { formatCurrency, formatDate, formatTime, titleCase } from "../../utils/format";

interface Props {
  purchases: RecentPurchase[];
}

export default function RecentPurchasesTable({ purchases }: Props) {
  if (purchases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-10 text-slate-400">
        <Clock size={28} className="mb-2 opacity-30" />
        <p className="text-sm">No purchases yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-5 py-3">Customer</th>
            <th className="px-5 py-3">Vehicle</th>
            <th className="px-5 py-3">Qty</th>
            <th className="px-5 py-3">Total</th>
            <th className="px-5 py-3">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {purchases.map((p) => {
            const total = Number(p.vehicle.price) * p.quantity;
            return (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-800">
                    {p.user.firstName} {p.user.lastName}
                  </p>
                  <p className="text-xs text-slate-400">{p.user.email}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-700">
                    {p.vehicle.make} {p.vehicle.model}
                  </p>
                  <p className="text-xs text-slate-400">
                    {titleCase(p.vehicle.category)}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
                    {p.quantity}
                  </span>
                </td>
                <td className="px-5 py-4 font-semibold text-slate-800">
                  {formatCurrency(total)}
                </td>
                <td className="px-5 py-4 text-xs text-slate-500">
                  {formatDate(p.purchasedAt)}
                  <br />
                  <span className="text-slate-400">
                    {formatTime(p.purchasedAt)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

