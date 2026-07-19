import { useQuery } from "@tanstack/react-query";
import { ReceiptText, ShoppingBag, WalletCards } from "lucide-react";
import PurchaseTable from "../features/purchases/PurchaseTable";
import { getPurchases } from "../services/purchase.service";
import { getVehicles } from "../services/vehicle.service";
import { useIsAdmin } from "../hooks/useAuth";
import { formatCurrency, formatNumber } from "../utils/format";

export default function PurchasesPage() {
  const isAdmin = useIsAdmin();

  const {
    data: purchasesData,
    isLoading: purchasesLoading,
    isError: purchasesError,
  } = useQuery({
    queryKey: ["purchases"],
    queryFn: getPurchases,
  });

  const { data: vehiclesData } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  });

  const purchases = purchasesData?.data ?? [];
  const vehicles = vehiclesData?.data ?? [];

  const totalUnits = purchases.reduce((sum, p) => sum + p.quantity, 0);
  const vehicleMap = new Map(vehicles.map((v) => [v.id, v]));
  const totalSpend = purchases.reduce((sum, p) => {
    const v = vehicleMap.get(p.vehicleId);
    return sum + (v ? Number(v.price) * p.quantity : 0);
  }, 0);

  const summary = [
    { label: "Total orders", value: formatNumber(purchases.length), icon: ReceiptText },
    { label: "Units", value: formatNumber(totalUnits), icon: ShoppingBag },
    { label: "Value", value: formatCurrency(totalSpend), icon: WalletCards },
  ];

  return (
    <div className="space-y-6">
      <section className="surface p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
          {isAdmin ? "Global registry" : "Purchase history"}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          {isAdmin ? "Transactions" : "My orders"}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          {isAdmin
            ? "Track every completed vehicle purchase across customers."
            : "Review your completed purchases and order value."}
        </p>
      </section>

      {!purchasesLoading && !purchasesError && purchases.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          {summary.map(({ label, value, icon: Icon }) => (
            <div key={label} className="surface p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-500">{label}</p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                    {value}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700 ring-1 ring-amber-100">
                  <Icon size={19} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {purchasesLoading ? (
        <div className="surface shimmer-effect h-56 w-full" />
      ) : purchasesError ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          Failed to load transactions.
        </div>
      ) : (
        <PurchaseTable
          purchases={purchases}
          vehicles={vehicles}
          showCustomer={isAdmin}
        />
      )}
    </div>
  );
}
