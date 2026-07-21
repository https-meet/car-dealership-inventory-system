import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Car, CheckCircle, ShoppingCart, TrendingUp, Users, XCircle, Package } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardCard from "../features/dashboard/DashboardCard";
import { getDashboardStats } from "../services/dashboard.service";
import { useAuth } from "../hooks/useAuth";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const user = useAuth();
  const { data, isLoading, isError } = useQuery({ queryKey: ["dashboard"], queryFn: getDashboardStats });
  const stats = data?.data;

  const total = stats ? stats.availableVehicles + stats.outOfStockVehicles : 0;
  const rate  = total ? Math.round((stats!.availableVehicles / total) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-up">

      {/* Welcome */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{greeting()}</p>
          <h2 className="text-2xl font-bold text-slate-900 mt-0.5">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-md">
            {user?.role === "ADMIN"
              ? "Manage your vehicle catalog, review purchases, and track dealership performance."
              : "Browse available inventory, make purchases, and view your transaction history."}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link to="/vehicles" className="btn-secondary gap-2">
            View inventory <ArrowRight size={14} />
          </Link>
          {user?.role === "ADMIN" && (
            <Link to="/reports" className="btn-primary gap-2">
              Analytics <TrendingUp size={14} />
            </Link>
          )}
        </div>
      </div>

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          Failed to load statistics. Please refresh.
        </div>
      )}

      {/* Stock health */}
      {stats && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package size={16} className="text-slate-400" />
              <span className="text-sm font-semibold text-slate-700">Inventory Health</span>
            </div>
            <span className="text-2xl font-bold text-slate-900">{rate}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-slate-900 transition-all duration-700"
              style={{ width: `${rate}%` }}
            />
          </div>
          <div className="mt-2.5 flex justify-between text-xs text-slate-500 font-medium">
            <span>{stats.availableVehicles} models in stock</span>
            <span>{stats.outOfStockVehicles} out of stock</span>
          </div>
        </div>
      )}

      {/* Metric cards */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Inventory Overview</p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton h-32 rounded-2xl" />
              ))
            : stats && [
                { title: "Total Vehicles",    value: stats.totalVehicles,      icon: Car,          color: "default" as const },
                { title: "Registered Users",  value: stats.totalCustomers,     icon: Users,        color: "blue"    as const },
                { title: "Total Purchases",   value: stats.totalPurchases,     icon: ShoppingCart, color: "default" as const },
                { title: "Available Models",  value: stats.availableVehicles,  icon: CheckCircle,  color: "green"   as const },
                { title: "Out of Stock",      value: stats.outOfStockVehicles, icon: XCircle,      color: "red"     as const },
              ].map((c, i) => (
                <div key={c.title} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <DashboardCard {...c} />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
