import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Car,
  CheckCircle,
  ShoppingCart,
  Users,
  XCircle,
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
    <div className="surface shimmer-effect p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="h-4 w-28 rounded bg-slate-100" />
        <div className="h-10 w-10 rounded-lg bg-slate-100" />
      </div>
      <div className="h-8 w-20 rounded bg-slate-100" />
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
        { title: "Fleet Catalog", value: stats.totalVehicles, icon: Car, tone: "teal" as const },
        { title: "Registered Users", value: stats.totalCustomers, icon: Users, tone: "sky" as const },
        { title: "Total Purchases", value: stats.totalPurchases, icon: ShoppingCart, tone: "amber" as const },
        { title: "Available Stock", value: stats.availableVehicles, icon: CheckCircle, tone: "slate" as const },
        { title: "Depleted Models", value: stats.outOfStockVehicles, icon: XCircle, tone: "rose" as const },
      ]
    : [];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
              {user?.role === "ADMIN" ? "Admin workspace" : "Customer showroom"}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              {getGreeting()}, {user?.firstName ?? "User"}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              {user?.role === "CUSTOMER"
                ? "Browse available vehicles, compare stock status, and complete purchases from the inventory."
                : "Review inventory health, manage catalog listings, and monitor purchase activity from one dashboard."}
            </p>
          </div>

          <Link to="/vehicles" className="btn-primary w-full sm:w-auto">
            View inventory
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {isError && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          Failed to load dashboard statistics. Please refresh the page.
        </div>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
            Inventory Overview
          </h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            : cardConfig.map((card) => (
                <DashboardCard
                  key={card.title}
                  title={card.title}
                  value={card.value}
                  icon={card.icon}
                  tone={card.tone}
                />
              ))}
        </div>
      </section>
    </div>
  );
}
