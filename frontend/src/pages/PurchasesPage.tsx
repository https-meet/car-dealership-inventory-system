import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, Receipt, TrendingUp } from "lucide-react";
import PurchaseTable from "../features/purchases/PurchaseTable";
import { getPurchases } from "../services/purchase.service";
import { getVehicles } from "../services/vehicle.service";
import { useAuth, useIsAdmin } from "../hooks/useAuth";

export default function PurchasesPage() {
  const user = useAuth();
  const isAdmin = useIsAdmin();

  const {
    data: purchasesData,
    isLoading: purchasesLoading,
    isError: purchasesError,
  } = useQuery({
    queryKey: ["purchases"],
    queryFn: getPurchases,
  });

  // Vehicles are already likely cached from VehiclesPage.
  // We fetch them here to build the vehicle name lookup map.
  const { data: vehiclesData } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  });

  const purchases = purchasesData?.data ?? [];
  const vehicles = vehiclesData?.data ?? [];

  // Compute summary stats
  const totalUnits = purchases.reduce((sum, p) => sum + p.quantity, 0);
  const vehicleMap = new Map(vehicles.map((v) => [v.id, v]));
  const totalSpend = purchases.reduce((sum, p) => {
    const v = vehicleMap.get(p.vehicleId);
    return sum + (v ? Number(v.price) * p.quantity : 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">
          <ShoppingBag size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isAdmin ? "All Purchases" : "My Purchases"}
          </h1>
          <p className="text-sm text-slate-500">
            {isAdmin
              ? "Complete purchase history across all customers"
              : `Logged in as ${user?.firstName} ${user?.lastName}`}
          </p>
        </div>
      </div>

      {/* Summary cards */}
      {!purchasesLoading && !purchasesError && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Receipt size={20} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Total Orders
              </p>
              <p className="mt-0.5 text-2xl font-bold text-slate-800">
                {purchases.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ShoppingBag size={20} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Units Purchased
              </p>
              <p className="mt-0.5 text-2xl font-bold text-slate-800">
                {totalUnits}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {isAdmin ? "Total Revenue" : "Total Spent"}
              </p>
              <p className="mt-0.5 text-2xl font-bold text-slate-800">
                ₹{totalSpend.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Purchase table */}
      {purchasesLoading ? (
        <div className="flex h-40 items-center justify-center text-slate-400">
          Loading purchases…
        </div>
      ) : purchasesError ? (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          Failed to load purchases. Please try again.
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
