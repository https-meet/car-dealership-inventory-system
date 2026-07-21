import { useQuery } from "@tanstack/react-query";
import { ReceiptText, ShoppingBag, WalletCards } from "lucide-react";
import PurchaseTable from "../features/purchases/PurchaseTable";
import { getPurchases } from "../services/purchase.service";
import { getVehicles } from "../services/vehicle.service";
import { useIsAdmin } from "../hooks/useAuth";
import { formatCurrency, formatNumber } from "../utils/format";

export default function PurchasesPage() {
  const isAdmin = useIsAdmin();

  const { data: purchasesData, isLoading, isError } = useQuery({
    queryKey: ["purchases"],
    queryFn: getPurchases,
  });

  const { data: vehiclesData } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  });

  const purchases = purchasesData?.data ?? [];
  const vehicles  = vehiclesData?.data  ?? [];

  const vehicleMap = new Map(vehicles.map((v) => [v.id, v]));
  const totalUnits = purchases.reduce((s, p) => s + p.quantity, 0);
  const totalValue = purchases.reduce((s, p) => {
    const v = vehicleMap.get(p.vehicleId);
    return s + (v ? Number(v.price) * p.quantity : 0);
  }, 0);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          {isAdmin ? "Transactions" : "My Orders"}
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          {isAdmin
            ? "Complete purchase history across all customers."
            : "Review your completed purchases and order value."}
        </p>
      </div>

      {/* Summary cards */}
      {!isLoading && !isError && purchases.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total Orders",  value: formatNumber(purchases.length), icon: ReceiptText },
            { label: "Units Sold",    value: formatNumber(totalUnits),        icon: ShoppingBag },
            { label: "Total Value",   value: formatCurrency(totalValue),      icon: WalletCards },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="card p-5 flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Icon size={18} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">{label}</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="skeleton h-56 w-full rounded-2xl" />
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          Failed to load transactions. Please refresh.
        </div>
      ) : (
        <PurchaseTable purchases={purchases} vehicles={vehicles} showCustomer={isAdmin} />
      )}
    </div>
  );
}
