import { ShoppingBag } from "lucide-react";
import type { Purchase } from "../../types/purchase";
import type { Vehicle } from "../../types/vehicle";

interface Props {
  purchases: Purchase[];
  vehicles: Vehicle[];
  showCustomer?: boolean; // ADMIN sees user ID column
}

// Build a vehicle lookup map from the vehicles list
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
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-16 text-slate-400">
        <ShoppingBag size={36} className="mb-3 opacity-40" />
        <p className="text-sm">No purchases found.</p>
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
            <th className="px-5 py-3">Unit Price</th>
            <th className="px-5 py-3">Qty</th>
            <th className="px-5 py-3">Total</th>
            {showCustomer && <th className="px-5 py-3">Customer ID</th>}
            <th className="px-5 py-3">Date</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-50">
          {purchases.map((purchase) => {
            const vehicle = vehicleMap.get(purchase.vehicleId);
            const unitPrice = vehicle ? Number(vehicle.price) : 0;
            const total = unitPrice * purchase.quantity;

            return (
              <tr
                key={purchase.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-5 py-4">
                  {vehicle ? (
                    <div>
                      <p className="font-medium text-slate-800">
                        {vehicle.make} {vehicle.model}
                      </p>
                      <p className="text-xs text-slate-400">{vehicle.year}</p>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">
                      Unknown vehicle
                    </span>
                  )}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {vehicle
                    ? vehicle.category.charAt(0) +
                      vehicle.category.slice(1).toLowerCase()
                    : "—"}
                </td>

                <td className="px-5 py-4 text-slate-700">
                  {unitPrice > 0
                    ? `₹${unitPrice.toLocaleString("en-IN")}`
                    : "—"}
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
                    {purchase.quantity}
                  </span>
                </td>

                <td className="px-5 py-4 font-semibold text-slate-800">
                  {total > 0 ? `₹${total.toLocaleString("en-IN")}` : "—"}
                </td>

                {showCustomer && (
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs text-slate-500">
                      {purchase.userId.slice(0, 8)}…
                    </span>
                  </td>
                )}

                <td className="px-5 py-4 text-xs text-slate-500">
                  {new Date(purchase.purchasedAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                  <br />
                  <span className="text-slate-400">
                    {new Date(purchase.purchasedAt).toLocaleTimeString(
                      "en-IN",
                      { hour: "2-digit", minute: "2-digit" }
                    )}
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
