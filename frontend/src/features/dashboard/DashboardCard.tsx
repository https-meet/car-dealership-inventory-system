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
  teal:  { icon: "text-emerald-600 bg-emerald-50",  num: "text-emerald-600" },
  amber: { icon: "text-amber-600 bg-amber-50",      num: "text-amber-600" },
  sky:   { icon: "text-sky-600 bg-sky-50",          num: "text-sky-600" },
  rose:  { icon: "text-rose-600 bg-rose-50",        num: "text-rose-600" },
  slate: { icon: "text-slate-600 bg-slate-100",     num: "text-slate-900" },
};

export default function DashboardCard({
  title,
  value,
  icon: Icon,
  tone = "slate",
  suffix,
}: DashboardCardProps) {
  const t = tones[tone];
  return (
    <div className="surface p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${t.icon}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500">{title}</p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className={`text-2xl font-bold tracking-tight ${t.num}`}>
            {formatNumber(value)}
          </span>
          {suffix && <span className="text-xs text-slate-400">{suffix}</span>}
        </div>
      </div>
    </div>
  );
}
