import type { LucideIcon } from "lucide-react";
import { formatNumber } from "../../utils/format";

type ColorTheme = "blue" | "violet" | "emerald" | "amber" | "rose";

interface DashboardCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color?: ColorTheme;
  suffix?: string;
}

const themeMap: Record<ColorTheme, { icon: string; bar: string; text: string }> = {
  blue:    { icon: "bg-blue-50 text-blue-600",    bar: "bg-blue-600",    text: "text-blue-600" },
  violet:  { icon: "bg-violet-50 text-violet-600", bar: "bg-violet-600",  text: "text-violet-600" },
  emerald: { icon: "bg-emerald-50 text-emerald-600", bar: "bg-emerald-500", text: "text-emerald-600" },
  amber:   { icon: "bg-amber-50 text-amber-600",   bar: "bg-amber-500",   text: "text-amber-600" },
  rose:    { icon: "bg-rose-50 text-rose-600",     bar: "bg-rose-600",    text: "text-rose-600" },
};

export default function DashboardCard({
  title,
  value,
  icon: Icon,
  color = "blue",
  suffix,
}: DashboardCardProps) {
  const theme = themeMap[color];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md">
      {/* Accent bar */}
      <div className={`absolute inset-x-0 top-0 h-1 ${theme.bar}`} />

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {title}
          </p>
          <p className="mt-3 text-3xl font-extrabold text-slate-800">
            {formatNumber(value)}
            {suffix && (
              <span className="ml-1 text-base font-medium text-slate-400">
                {suffix}
              </span>
            )}
          </p>
        </div>

        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${theme.icon}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
