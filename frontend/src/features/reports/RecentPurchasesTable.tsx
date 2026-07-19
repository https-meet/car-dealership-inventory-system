import { Clock } from "lucide-react";
import type { RecentPurchase } from "../../types/report";
import { formatCurrency, formatDate, formatTime, titleCase } from "../../utils/format";

interface Props {
  purchases: RecentPurchase[];
}

export default function RecentPurchasesTable({ purchases }: Props) {
  if (purchases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white py-10 text-center">
        <Clock size={30} className="mb-2 text-slate-300" />
        <p className="text-sm font-semibold text-slate-700">No purchases yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:hidden">
        {purchases.map((p) => {
          const total = Number(p.vehicle.price) * p.quantity;
          return (
            <article key={p.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-950">
                    {p.vehicle.make} {p.vehicle.model}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {p.user.firstName} {p.user.lastName}
                  </p>
                </div>
                <p className="text-right text-xs font-semibold text-slate-500">
                  {formatDate(p.purchasedAt)}
                  <span className="block">{formatTime(p.purchasedAt)}</span>
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 p-3">
                <span className="text-sm font-semibold text-slate-600">
                  Qty {p.quantity}
                </span>
                <span className="text-sm font-bold text-slate-950">
                  {formatCurrency(total)}
                </span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="hidden overflow-hidden rounded-lg border border-slate-200 md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Vehicle</th>
                <th className="px-5 py-3">Qty</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {purchases.map((p) => {
                const total = Number(p.vehicle.price) * p.quantity;
                return (
                  <tr key={p.id} className="transition hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-950">
                        {p.user.firstName} {p.user.lastName}
                      </p>
                      <p className="text-xs font-medium text-slate-500">
                        {p.user.email}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-950">
                        {p.vehicle.make} {p.vehicle.model}
                      </p>
                      <p className="text-xs font-medium text-slate-500">
                        {titleCase(p.vehicle.category)}
                      </p>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-950">
                      {p.quantity}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-950">
                      {formatCurrency(total)}
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-slate-500">
                      {formatDate(p.purchasedAt)}
                      <span className="block text-slate-400">
                        {formatTime(p.purchasedAt)}
                      </span>
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
