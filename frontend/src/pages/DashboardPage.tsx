import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Car,
  CheckCircle,
  Gauge,
  ShoppingCart,
  TrendingUp,
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
        <div className="h-10 w-10 rounded-xl bg-slate-100" />
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
  const stockTotal = stats
    ? stats.availableVehicles + stats.outOfStockVehicles
    : 0;
  const availabilityRate = stockTotal
    ? Math.round((stats!.availableVehicles / stockTotal) * 100)
    : 0;

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
      <section className="mesh-panel overflow-hidden rounded-3xl p-5 text-white shadow-2xl shadow-teal-950/20 sm:p-6 lg:p-7">
        <div className="grid gap-7 lg:grid-cols-[1fr_360px] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-teal-50">
              <Gauge size={14} />
              {user?.role === "ADMIN" ? "Admin workspace" : "Customer showroom"}
            </div>

            <h2 className="mt-5 max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">
              {getGreeting()}, {user?.firstName ?? "User"}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-100/85">
              {user?.role === "CUSTOMER"
                ? "Explore the live showroom, compare availability, and complete purchases from protected inventory data."
                : "Track inventory health, manage catalog movement, and monitor dealership activity from one workspace."}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link to="/vehicles" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-teal-50">
                View inventory
                <ArrowRight size={16} />
              </Link>
              {user?.role === "ADMIN" && (
                <Link to="/reports" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/15">
                  Open reports
                  <TrendingUp size={16} />
                </Link>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-100">
                  Availability
                </p>
                <p className="mt-2 text-4xl font-black">
                  {isLoading ? "--" : `${availabilityRate}%`}
                </p>
              </div>
              <div className="animate-soft-pulse rounded-2xl bg-teal-300/20 p-3 text-teal-100 ring-1 ring-teal-100/20">
                <TrendingUp size={24} />
              </div>
            </div>

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-200 to-amber-200 transition-all duration-700"
                style={{ width: `${availabilityRate}%` }}
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/10 p-3">
                <p className="text-xs font-semibold text-slate-100/70">Available</p>
                <p className="mt-1 text-xl font-black">{stats?.availableVehicles ?? "--"}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3">
                <p className="text-xs font-semibold text-slate-100/70">Out of stock</p>
                <p className="mt-1 text-xl font-black">{stats?.outOfStockVehicles ?? "--"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          Failed to load dashboard statistics. Please refresh the page.
        </div>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">
            Inventory Overview
          </h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            : cardConfig.map((card, index) => (
                <div
                  key={card.title}
                  className="animate-rise-in"
                  style={{ animationDelay: `${index * 60}ms` }}
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
      </section>
    </div>
  );
}
