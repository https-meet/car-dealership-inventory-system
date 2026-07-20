import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Car,
  CheckCircle,
  ShoppingCart,
  TrendingUp,
  Users,
  XCircle,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";
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
    <div className="surface p-5 shimmer-effect h-28" />
  );
}

export default function DashboardPage() {
  const user = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardStats,
  });

  const stats = data?.data;

  const totalStock = stats ? stats.availableVehicles + stats.outOfStockVehicles : 0;
  const availabilityRate = totalStock
    ? Math.round((stats!.availableVehicles / totalStock) * 100)
    : 0;

  const cardConfig = stats
    ? [
        { title: "Fleet Catalog",    value: stats.totalVehicles,       icon: Car,          tone: "slate" as const },
        { title: "Registered Users", value: stats.totalCustomers,      icon: Users,        tone: "slate" as const },
        { title: "Purchases Made",   value: stats.totalPurchases,      icon: ShoppingCart, tone: "slate" as const },
        { title: "Models Available", value: stats.availableVehicles,   icon: CheckCircle,  tone: "teal" as const },
        { title: "Out of Stock",     value: stats.outOfStockVehicles,  icon: XCircle,      tone: "rose" as const },
      ]
    : [];

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Welcome header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{getGreeting()}</p>
          <h2 className="text-2xl font-bold text-slate-900 mt-0.5">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {user?.role === "ADMIN"
              ? "Manage your dealership inventory, purchases, and analytics."
              : "Browse available vehicles and track your purchase history."}
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <Link to="/vehicles" className="btn-secondary">
            View inventory
            <ArrowRight size={15} />
          </Link>
          {user?.role === "ADMIN" && (
            <Link to="/reports" className="btn-primary">
              Analytics
              <TrendingUp size={15} />
            </Link>
          )}
        </div>
      </div>

      {/* Error state */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          Failed to load statistics. Please refresh the page.
        </div>
      )}

      {/* Stock availability banner */}
      {stats && (
        <div className="surface p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Package size={16} className="text-slate-500" />
              <span className="text-sm font-semibold text-slate-700">Stock Availability</span>
            </div>
            <span className="text-2xl font-bold text-slate-900">{availabilityRate}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-slate-900 transition-all duration-700"
              style={{ width: `${availabilityRate}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-slate-500 font-medium">
            <span>{stats.availableVehicles} models in stock</span>
            <span>{stats.outOfStockVehicles} out of stock</span>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
          Inventory Overview
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            : cardConfig.map((card, i) => (
                <div
                  key={card.title}
                  className="animate-fade-in"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <DashboardCard
                    title={card.title}
                    value={card.value}
                    icon={card.icon}
                    tone={card.tone}
                  />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
