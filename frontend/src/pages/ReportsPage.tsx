import type { ReactNode } from "react";
import { useQueries } from "@tanstack/react-query";
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

interface ReportSectionProps {
  title: string;
  count?: number;
  isLoading: boolean;
  isError: boolean;
  children: ReactNode;
}

function ReportSection({
  title,
  count,
  isLoading,
  isError,
  children,
}: ReportSectionProps) {
  return (
    <section className="surface overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4">
        <h3 className="text-sm font-bold text-slate-950">{title}</h3>
        {count !== undefined && !isLoading && !isError && (
          <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-500">
            {count} items
          </span>
        )}
      </div>
      <div className="p-5">
        {isLoading ? (
          <div className="shimmer-effect h-36 w-full rounded-lg border border-slate-200 bg-slate-50" />
        ) : isError ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
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
      { queryKey: ["reports", "low-stock"], queryFn: () => getLowStock(5) },
      { queryKey: ["reports", "recent-purchases"], queryFn: () => getRecentPurchases(10) },
      { queryKey: ["reports", "top-selling"], queryFn: () => getTopSelling(10) },
      { queryKey: ["reports", "sales-summary"], queryFn: getSalesSummary },
    ],
  });

  return (
    <div className="space-y-6">
      <section className="surface p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
          Admin analytics
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          Reports
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Monitor revenue, low stock vehicles, recent purchases, and top sellers.
        </p>
      </section>

      <ReportSection
        title="Revenue overview"
        isLoading={salesSummary.isLoading}
        isError={salesSummary.isError}
      >
        {salesSummary.data && (
          <SalesSummaryCard summary={salesSummary.data.data} />
        )}
      </ReportSection>

      <div className="grid gap-6 xl:grid-cols-2">
        <ReportSection
          title="Low stock alerts"
          count={lowStock.data?.data.length}
          isLoading={lowStock.isLoading}
          isError={lowStock.isError}
        >
          {lowStock.data && <LowStockTable vehicles={lowStock.data.data} />}
        </ReportSection>

        <ReportSection
          title="Top sellers"
          count={topSelling.data?.data.length}
          isLoading={topSelling.isLoading}
          isError={topSelling.isError}
        >
          {topSelling.data && <TopSellingTable entries={topSelling.data.data} />}
        </ReportSection>
      </div>

      <ReportSection
        title="Recent transactions"
        count={recentPurchases.data?.data.length}
        isLoading={recentPurchases.isLoading}
        isError={recentPurchases.isError}
      >
        {recentPurchases.data && (
          <RecentPurchasesTable purchases={recentPurchases.data.data} />
        )}
      </ReportSection>
    </div>
  );
}
