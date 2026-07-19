import { useQuery } from "@tanstack/react-query";
import DashboardCard from "../features/dashboard/DashboardCard";
import { getDashboardStats } from "../services/dashboard.service";

export default function DashboardPage() {
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="text-lg font-medium">
        Loading dashboard...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-red-600">
        Failed to load dashboard.
      </div>
    );
  }

  const stats = data.data;

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        Dashboard
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Total Vehicles"
          value={stats.totalVehicles}
        />

        <DashboardCard
          title="Total Customers"
          value={stats.totalCustomers}
        />

        <DashboardCard
          title="Total Purchases"
          value={stats.totalPurchases}
        />

        <DashboardCard
          title="Available Vehicles"
          value={stats.availableVehicles}
        />

        <DashboardCard
          title="Out Of Stock"
          value={stats.outOfStockVehicles}
        />
      </div>
    </div>
  );
}