import { ReceiptText } from "lucide-react";
import type { Purchase } from "../../types/purchase";
import type { Vehicle } from "../../types/vehicle";
import { formatCurrency, formatDate, titleCase } from "../../utils/format";

interface Props {
  purchases: Purchase[];
  vehicles: Vehicle[];
  showCustomer?: boolean;
}

export default function PurchaseTable({ purchases, vehicles, showCustomer = false }: Props) {
  const vehicleMap = new Map(vehicles.map((v) => [v.id, v]));

  if (purchases.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-16 text-center border-dashed">
        <ReceiptText size={32} className="mb-3 text-slate-300" />
        <p className="text-sm font-semibold text-slate-700">No purchases found</p>
        <p className="mt-1 text-sm text-slate-500">Completed purchases will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Mobile cards */}
      <div className="grid gap-3 md:hidden">
        {purchases.map((p) => {
          const v = vehicleMap.get(p.vehicleId);
          const total = (v ? Number(v.price) : 0) * p.quantity;
          return (
            <div key={p.id} className="card p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 truncate">
                    {v ? `${v.make} ${v.model}` : "Unknown vehicle"}
                  </p>
                  {v && <p className="text-xs text-slate-500 mt-0.5">{titleCase(v.category)} · {formatCurrency(Number(v.price))} each</p>}
                </div>
                <p className="shrink-0 text-xs text-slate-400 font-medium">{formatDate(p.purchasedAt)}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
                <div>
                  <p className="text-xs font-medium text-slate-500">Qty</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{p.quantity}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Total</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{formatCurrency(total)}</p>
                </div>
              </div>
              {showCustomer && (
                <p className="font-mono text-xs text-slate-400">Customer: {p.userId.slice(0, 8)}…</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/70">
              <tr>
                {["Date", "Vehicle", "Qty", "Total", ...(showCustomer ? ["Customer"] : [])].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {purchases.map((p) => {
                const v = vehicleMap.get(p.vehicleId);
                const total = (v ? Number(v.price) : 0) * p.quantity;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-slate-500 text-xs font-medium whitespace-nowrap">{formatDate(p.purchasedAt)}</td>
                    <td className="px-5 py-3.5">
                      {v ? (
                        <div>
                          <p className="font-semibold text-slate-900">{v.make} {v.model}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{titleCase(v.category)} · {formatCurrency(Number(v.price))} each</p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-xs">Unknown vehicle</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">{p.quantity}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">{formatCurrency(total)}</td>
                    {showCustomer && (
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-400">{p.userId.slice(0, 8)}…</td>
                    )}
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
