import { useQuery } from "@tanstack/react-query";
import {
  Car,
  Users,
  ShoppingCart,
  CheckCircle,
  XCircle,
} from "lucide-react";
import DashboardCard from "../features/dashboard/DashboardCard";
import { getDashboardStats } from "../services/dashboard.service";
import { useAuth } from "../hooks/useAuth";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function SkeletonCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <div className="absolute inset-x-0 top-0 h-1 bg-slate-100 animate-pulse" />
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <div className="h-3 w-24 rounded bg-slate-100 animate-pulse" />
          <div className="h-8 w-16 rounded bg-slate-100 animate-pulse" />
        </div>
        <div className="h-11 w-11 rounded-xl bg-slate-100 animate-pulse" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const user = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardStats,
  });

  const stats = data?.data;

  const cardConfig = stats
    ? [
        { title: "Total Vehicles",    value: stats.totalVehicles,    icon: Car,          color: "blue"    as const },
        { title: "Total Customers",   value: stats.totalCustomers,   icon: Users,         color: "violet"  as const },
        { title: "Total Purchases",   value: stats.totalPurchases,   icon: ShoppingCart,  color: "emerald" as const },
        { title: "Available Vehicles",value: stats.availableVehicles,icon: CheckCircle,   color: "amber"   as const },
        { title: "Out of Stock",      value: stats.outOfStockVehicles,icon: XCircle,      color: "rose"    as const },
      ]
    : [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page header */}
      <div>
        <p className="text-sm font-medium text-slate-400">{getGreeting()},</p>
        <h1 className="mt-0.5 text-3xl font-extrabold text-slate-800">
          {user ? `${user.firstName} ${user.lastName}` : "Dashboard"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {user?.role === "CUSTOMER"
            ? "Browse available vehicles and track your purchases."
            : "Here's what's happening with your inventory today."}
        </p>
      </div>

      {/* Error state */}
      {isError && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          Failed to load dashboard statistics. Please refresh the page.
        </div>
      )}

      {/* Stats grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          : cardConfig.map((card) => (
              <DashboardCard
                key={card.title}
                title={card.title}
                value={card.value}
                icon={card.icon}
                color={card.color}
              />
            ))}
      </div>
    </div>
  );
}