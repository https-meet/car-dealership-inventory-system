import { Menu, ShieldCheck } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface NavbarProps {
  onMenuClick: () => void;
}

const TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/vehicles": "Inventory",
  "/purchases": "Transactions",
  "/reports": "Analytics",
};

function initials(firstName?: string, lastName?: string) {
  return `${firstName?.[0] ?? "U"}${lastName?.[0] ?? ""}`;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const user = useAuth();
  const location = useLocation();
  const title = TITLES[location.pathname] ?? "Dashboard";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onMenuClick}
            className="icon-button md:hidden"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
              Kata Inventory
            </p>
            <h1 className="truncate text-base font-semibold text-slate-950 sm:text-lg">
              {title}
            </h1>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 sm:flex">
              <ShieldCheck size={14} />
              {user.role === "ADMIN" ? "Admin" : "Customer"}
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-xs font-bold uppercase text-white shadow-sm">
              {initials(user.firstName, user.lastName)}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
