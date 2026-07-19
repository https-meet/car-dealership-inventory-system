import { DollarSign, ShoppingBag, Receipt } from "lucide-react";
import type { SalesSummary } from "../../types/report";

interface Props {
  summary: SalesSummary;
}

const stats = (summary: SalesSummary) => [
  {
    label: "Total Revenue",
    value: `₹${Number(summary.totalRevenue).toLocaleString("en-IN")}`,
    icon: DollarSign,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    label: "Units Sold",
    value: summary.totalUnitsSold.toLocaleString("en-IN"),
    icon: ShoppingBag,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    label: "Total Transactions",
    value: summary.totalPurchases.toLocaleString("en-IN"),
    icon: Receipt,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
];

export default function SalesSummaryCard({ summary }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats(summary).map(({ label, value, icon: Icon, color, bg, border }) => (
        <div
          key={label}
          className={`flex items-center gap-4 rounded-xl border ${border} bg-white p-5 shadow-sm`}
        >
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${bg} ${color}`}
          >
            <Icon size={22} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {label}
            </p>
            <p className="mt-0.5 text-2xl font-bold text-slate-800">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
