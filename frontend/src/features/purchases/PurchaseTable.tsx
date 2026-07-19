import { ReceiptText } from "lucide-react";
import type { Purchase } from "../../types/purchase";
import type { Vehicle } from "../../types/vehicle";
import { formatCurrency, formatDate, titleCase } from "../../utils/format";

interface Props {
  purchases: Purchase[];
  vehicles: Vehicle[];
  showCustomer?: boolean;
}

function buildVehicleMap(vehicles: Vehicle[]): Map<string, Vehicle> {
  return new Map(vehicles.map((v) => [v.id, v]));
}

export default function PurchaseTable({
  purchases,
  vehicles,
  showCustomer = false,
}: Props) {
  const vehicleMap = buildVehicleMap(vehicles);

  if (purchases.length === 0) {
    return (
      <div className="surface flex flex-col items-center justify-center border-dashed py-16 text-center">
        <ReceiptText size={34} className="mb-3 text-slate-300" />
        <p className="text-sm font-semibold text-slate-700">No purchases found</p>
        <p className="mt-1 text-sm text-slate-500">
          Completed purchases will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:hidden">
        {purchases.map((purchase) => {
          const vehicle = vehicleMap.get(purchase.vehicleId);
          const unitPrice = vehicle ? Number(vehicle.price) : 0;
          const total = unitPrice * purchase.quantity;

          return (
            <article key={purchase.id} className="premium-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-950">
                    {vehicle ? `${vehicle.make} ${vehicle.model}` : "Unknown vehicle"}
                  </p>
                  {vehicle && (
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      {titleCase(vehicle.category)} - {formatCurrency(unitPrice)} each
                    </p>
                  )}
                </div>
                <p className="shrink-0 text-xs font-semibold text-slate-500">
                  {formatDate(purchase.purchasedAt)}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Quantity</p>
                  <p className="mt-1 text-sm font-bold text-slate-950">
                    {purchase.quantity}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Total</p>
                  <p className="mt-1 text-sm font-bold text-slate-950">
                    {formatCurrency(total)}
                  </p>
                </div>
              </div>

              {showCustomer && (
                <p className="mt-3 font-mono text-xs text-slate-500">
                  Customer {purchase.userId.slice(0, 8)}...
                </p>
              )}
            </article>
          );
        })}
      </div>

      <div className="premium-surface hidden overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Vehicle</th>
                <th className="px-5 py-3">Qty</th>
                <th className="px-5 py-3">Total</th>
                {showCustomer && <th className="px-5 py-3">Customer ID</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {purchases.map((purchase) => {
                const vehicle = vehicleMap.get(purchase.vehicleId);
                const unitPrice = vehicle ? Number(vehicle.price) : 0;
                const total = unitPrice * purchase.quantity;

                return (
                  <tr key={purchase.id} className="transition hover:bg-slate-50/70">
                    <td className="px-5 py-4 font-medium text-slate-500">
                      {formatDate(purchase.purchasedAt)}
                    </td>
                    <td className="px-5 py-4">
                      {vehicle ? (
                        <div className="font-bold text-slate-950">
                          {vehicle.make} {vehicle.model}
                          <span className="mt-0.5 block text-xs font-medium text-slate-500">
                            {titleCase(vehicle.category)} - {formatCurrency(unitPrice)} each
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unknown</span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-950">
                      {purchase.quantity}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-950">
                      {formatCurrency(total)}
                    </td>
                    {showCustomer && (
                      <td className="px-5 py-4 font-mono text-xs text-slate-500">
                        {purchase.userId.slice(0, 8)}...
                      </td>
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
