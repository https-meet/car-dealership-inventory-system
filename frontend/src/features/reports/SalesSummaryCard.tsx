import { Receipt, ShoppingBag, WalletCards } from "lucide-react";
import type { SalesSummary } from "../../types/report";
import { formatCurrency, formatNumber } from "../../utils/format";

interface Props {
  summary: SalesSummary;
}

const stats = (summary: SalesSummary) => [
  {
    label: "Total Revenue",
    value: formatCurrency(summary.totalRevenue),
    icon: WalletCards,
    tone: "bg-teal-50 text-teal-700 ring-teal-100",
  },
  {
    label: "Units Sold",
    value: formatNumber(summary.totalUnitsSold),
    icon: ShoppingBag,
    tone: "bg-sky-50 text-sky-700 ring-sky-100",
  },
  {
    label: "Total Transactions",
    value: formatNumber(summary.totalPurchases),
    icon: Receipt,
    tone: "bg-amber-50 text-amber-700 ring-amber-100",
  },
];

export default function SalesSummaryCard({ summary }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats(summary).map(({ label, value, icon: Icon, tone }) => (
        <div key={label} className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">{label}</p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                {value}
              </p>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ring-1 ${tone}`}>
              <Icon size={19} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
