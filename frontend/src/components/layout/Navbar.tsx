import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface NavbarProps { onMenuClick: () => void; }

const PAGES: Record<string, { title: string; sub: string }> = {
  "/dashboard": { title: "Overview",     sub: "Dashboard & metrics" },
  "/vehicles":  { title: "Inventory",    sub: "Vehicle catalog" },
  "/purchases": { title: "Transactions", sub: "Purchase history" },
  "/reports":   { title: "Analytics",   sub: "Reports & insights" },
};

function initials(fn?: string, ln?: string) {
  return `${fn?.[0] ?? ""}${ln?.[0] ?? ""}`.toUpperCase();
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const user = useAuth();
  const { pathname } = useLocation();
  const page = PAGES[pathname] ?? { title: "Dashboard", sub: "" };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b border-slate-200 bg-white/90 backdrop-blur-md px-4 sm:px-6">
      {/* Left: hamburger + page title */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          onClick={onMenuClick}
          className="icon-btn md:hidden shrink-0"
          aria-label="Open navigation"
        >
          <Menu size={18} />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold text-slate-900 leading-tight">{page.title}</h1>
          {page.sub && (
            <p className="hidden sm:block text-xs text-slate-500 font-medium leading-tight">{page.sub}</p>
          )}
        </div>
      </div>

      {/* Right: user info */}
      {user && (
        <div className="flex shrink-0 items-center gap-3 pl-4 border-l border-slate-200">
          <div className="hidden sm:block text-right leading-tight">
            <p className="text-xs font-semibold text-slate-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-[10px] text-slate-500">
              {user.role === "ADMIN" ? "Administrator" : "Customer"}
            </p>
          </div>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[11px] font-bold text-white select-none">
            {initials(user.firstName, user.lastName)}
          </div>
        </div>
      )}
    </header>
  );
}
