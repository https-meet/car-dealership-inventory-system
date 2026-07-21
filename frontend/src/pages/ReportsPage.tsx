import type { ReactNode } from "react";
import { useQueries } from "@tanstack/react-query";
import SalesSummaryCard from "../features/reports/SalesSummaryCard";
import LowStockTable from "../features/reports/LowStockTable";
import RecentPurchasesTable from "../features/reports/RecentPurchasesTable";
import TopSellingTable from "../features/reports/TopSellingTable";
import { getLowStock, getRecentPurchases, getTopSelling, getSalesSummary } from "../services/report.service";

function ReportSection({
  title,
  count,
  isLoading,
  isError,
  children,
}: {
  title: string;
  count?: number;
  isLoading: boolean;
  isError: boolean;
  children: ReactNode;
}) {
  return (
    <section className="card overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/70 px-5 py-3.5">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {count !== undefined && !isLoading && !isError && (
          <span className="badge-slate">{count} items</span>
        )}
      </div>
      <div className="p-5">
        {isLoading ? (
          <div className="skeleton h-36 w-full" />
        ) : isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            Failed to load data.
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

export default function ReportsPage() {
  const [lowStock, recentPurchases, topSelling, salesSummary] = useQueries({
    queries: [
      { queryKey: ["reports", "low-stock"],        queryFn: () => getLowStock(5) },
      { queryKey: ["reports", "recent-purchases"], queryFn: () => getRecentPurchases(10) },
      { queryKey: ["reports", "top-selling"],      queryFn: () => getTopSelling(10) },
      { queryKey: ["reports", "sales-summary"],    queryFn: getSalesSummary },
    ],
  });

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Revenue overview, inventory health, and top-performing vehicles.
        </p>
      </div>

      <ReportSection title="Revenue Overview" isLoading={salesSummary.isLoading} isError={salesSummary.isError}>
        {salesSummary.data && <SalesSummaryCard summary={salesSummary.data.data} />}
      </ReportSection>

      <div className="grid gap-6 xl:grid-cols-2">
        <ReportSection
          title="Low Stock Alerts"
          count={lowStock.data?.data.length}
          isLoading={lowStock.isLoading}
          isError={lowStock.isError}
        >
          {lowStock.data && <LowStockTable vehicles={lowStock.data.data} />}
        </ReportSection>

        <ReportSection
          title="Top Sellers"
          count={topSelling.data?.data.length}
          isLoading={topSelling.isLoading}
          isError={topSelling.isError}
        >
          {topSelling.data && <TopSellingTable entries={topSelling.data.data} />}
        </ReportSection>
      </div>

      <ReportSection
        title="Recent Transactions"
        count={recentPurchases.data?.data.length}
        isLoading={recentPurchases.isLoading}
        isError={recentPurchases.isError}
      >
        {recentPurchases.data && <RecentPurchasesTable purchases={recentPurchases.data.data} />}
      </ReportSection>
    </div>
  );
}
