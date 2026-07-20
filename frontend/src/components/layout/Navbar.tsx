import { Menu, Bell } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface NavbarProps {
  onMenuClick: () => void;
}

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Overview",     subtitle: "Dashboard & metrics" },
  "/vehicles":  { title: "Inventory",    subtitle: "Vehicle catalog" },
  "/purchases": { title: "Transactions", subtitle: "Purchase history" },
  "/reports":   { title: "Analytics",   subtitle: "Reports & insights" },
};

function initials(firstName?: string, lastName?: string) {
  return `${firstName?.[0] ?? "U"}${lastName?.[0] ?? ""}`.toUpperCase();
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const user = useAuth();
  const location = useLocation();
  const page = PAGE_TITLES[location.pathname] ?? { title: "Dashboard", subtitle: "" };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex flex-1 items-center gap-4">
        {/* Hamburger – mobile only */}
        <button
          onClick={onMenuClick}
          className="icon-button md:hidden"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        {/* Page title */}
        <div className="min-w-0">
          <h1 className="text-base font-semibold text-slate-900 leading-tight truncate">
            {page.title}
          </h1>
          {page.subtitle && (
            <p className="text-xs text-slate-500 font-medium leading-tight hidden sm:block">
              {page.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        <button className="icon-button relative" aria-label="Notifications">
          <Bell size={17} />
        </button>

        {user && (
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 ml-1">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                {user.role === "ADMIN" ? "Administrator" : "Customer"}
              </p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-[11px] font-bold text-white">
              {initials(user.firstName, user.lastName)}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
