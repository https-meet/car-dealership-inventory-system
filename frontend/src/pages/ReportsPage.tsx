import { useQueries } from "@tanstack/react-query";
import {
  BarChart3,
  AlertTriangle,
  Clock,
  Trophy,
  TrendingUp,
} from "lucide-react";
import SalesSummaryCard from "../features/reports/SalesSummaryCard";
import LowStockTable from "../features/reports/LowStockTable";
import RecentPurchasesTable from "../features/reports/RecentPurchasesTable";
import TopSellingTable from "../features/reports/TopSellingTable";
import {
  getLowStock,
  getRecentPurchases,
  getTopSelling,
  getSalesSummary,
} from "../services/report.service";

// ─── Section wrapper ──────────────────────────────────────────────────────────
interface ReportSectionProps {
  title: string;
  icon: React.ReactNode;
  count?: number;
  isLoading: boolean;
  isError: boolean;
  children: React.ReactNode;
}

function ReportSection({
  title,
  icon,
  count,
  isLoading,
  isError,
  children,
}: ReportSectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-slate-500">{icon}</span>
        <h2 className="text-base font-semibold text-slate-700">{title}</h2>
        {count !== undefined && !isLoading && !isError && (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
            {count}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
      ) : isError ? (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          Failed to load this report. Please try again.
        </div>
      ) : (
        children
      )}
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const [lowStock, recentPurchases, topSelling, salesSummary] = useQueries({
    queries: [
      {
        queryKey: ["reports", "low-stock"],
        queryFn: () => getLowStock(5),
      },
      {
        queryKey: ["reports", "recent-purchases"],
        queryFn: () => getRecentPurchases(10),
      },
      {
        queryKey: ["reports", "top-selling"],
        queryFn: () => getTopSelling(10),
      },
      {
        queryKey: ["reports", "sales-summary"],
        queryFn: getSalesSummary,
      },
    ],
  });

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600 text-white">
          <BarChart3 size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
          <p className="text-sm text-slate-500">
            Analytics and inventory insights — Admin view
          </p>
        </div>
      </div>

      {/* Sales Summary */}
      <ReportSection
        title="Sales Summary"
        icon={<TrendingUp size={18} />}
        isLoading={salesSummary.isLoading}
        isError={salesSummary.isError}
      >
        {salesSummary.data && (
          <SalesSummaryCard summary={salesSummary.data.data} />
        )}
      </ReportSection>

      {/* Low Stock */}
      <ReportSection
        title="Low Stock Vehicles"
        icon={<AlertTriangle size={18} />}
        count={lowStock.data?.data.length}
        isLoading={lowStock.isLoading}
        isError={lowStock.isError}
      >
        {lowStock.data && (
          <LowStockTable vehicles={lowStock.data.data} />
        )}
      </ReportSection>

      {/* Recent Purchases */}
      <ReportSection
        title="Recent Purchases"
        icon={<Clock size={18} />}
        count={recentPurchases.data?.data.length}
        isLoading={recentPurchases.isLoading}
        isError={recentPurchases.isError}
      >
        {recentPurchases.data && (
          <RecentPurchasesTable purchases={recentPurchases.data.data} />
        )}
      </ReportSection>

      {/* Top Selling */}
      <ReportSection
        title="Top Selling Vehicles"
        icon={<Trophy size={18} />}
        count={topSelling.data?.data.length}
        isLoading={topSelling.isLoading}
        isError={topSelling.isError}
      >
        {topSelling.data && (
          <TopSellingTable entries={topSelling.data.data} />
        )}
      </ReportSection>
    </div>
  );
}
