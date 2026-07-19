import type { LucideIcon } from "lucide-react";
import { formatNumber } from "../../utils/format";

interface DashboardCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  tone?: "teal" | "amber" | "sky" | "rose" | "slate";
  suffix?: string;
}

const tones = {
  teal: "bg-teal-50 text-teal-700 ring-teal-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  sky: "bg-sky-50 text-sky-700 ring-sky-100",
  rose: "bg-rose-50 text-rose-700 ring-rose-100",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
};

export default function DashboardCard({
  title,
  value,
  icon: Icon,
  tone = "slate",
  suffix,
}: DashboardCardProps) {
  return (
    <div className="surface p-5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <div className="mt-3 flex items-baseline gap-1.5">
            <h3 className="text-3xl font-bold tracking-tight text-slate-950">
              {formatNumber(value)}
            </h3>
            {suffix && (
              <span className="text-sm font-semibold text-slate-400">
                {suffix}
              </span>
            )}
          </div>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1 ${tones[tone]}`}
        >
          <Icon size={19} strokeWidth={2.2} />
        </div>
      </div>
    </div>
  );
}
