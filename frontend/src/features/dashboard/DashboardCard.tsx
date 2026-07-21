import type { LucideIcon } from "lucide-react";
import { formatNumber } from "../../utils/format";

interface Props {
  title: string;
  value: number;
  icon: LucideIcon;
  color?: "default" | "green" | "red" | "amber" | "blue";
  suffix?: string;
}

const colors = {
  default: { wrap: "bg-slate-100 text-slate-600",   val: "text-slate-900" },
  green:   { wrap: "bg-emerald-50 text-emerald-600", val: "text-emerald-700" },
  red:     { wrap: "bg-red-50 text-red-600",         val: "text-red-700" },
  amber:   { wrap: "bg-amber-50 text-amber-600",     val: "text-amber-700" },
  blue:    { wrap: "bg-blue-50 text-blue-600",       val: "text-blue-700" },
};

export default function DashboardCard({ title, value, icon: Icon, color = "default", suffix }: Props) {
  const c = colors[color];
  return (
    <div className="card p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${c.wrap}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500">{title}</p>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className={`text-2xl font-bold tracking-tight ${c.val}`}>{formatNumber(value)}</span>
          {suffix && <span className="text-xs text-slate-400">{suffix}</span>}
        </div>
      </div>
    </div>
  );
}
