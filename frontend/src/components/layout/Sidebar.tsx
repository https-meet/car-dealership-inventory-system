import {
  LayoutDashboard,
  Car,
  ShoppingCart,
  BarChart3,
  LogOut,
  X,
  Car as CarIcon,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ALL_MENU = [
  { name: "Overview",     path: "/dashboard", icon: LayoutDashboard, roles: ["ADMIN", "CUSTOMER"] as const },
  { name: "Inventory",    path: "/vehicles",  icon: Car,             roles: ["ADMIN", "CUSTOMER"] as const },
  { name: "Transactions", path: "/purchases", icon: ShoppingCart,    roles: ["ADMIN", "CUSTOMER"] as const },
  { name: "Analytics",    path: "/reports",   icon: BarChart3,       roles: ["ADMIN"] as const },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const user = useAuth();

  const menu = ALL_MENU.filter((item) =>
    user ? (item.roles as readonly string[]).includes(user.role) : false
  );

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* Backdrop – only on mobile when open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col
          border-r border-slate-200 bg-white
          shadow-xl shadow-slate-900/10
          transition-transform duration-300 ease-out
          md:static md:z-auto md:translate-x-0 md:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
              <CarIcon size={16} />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-slate-900">Kata Inventory</p>
              <p className="text-[10px] text-slate-400 font-medium">Car Dealership System</p>
            </div>
          </div>

          {/* Close button – mobile only */}
          <button
            onClick={onClose}
            className="icon-button md:hidden"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {menu.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <Icon size={17} />
              {name}
            </NavLink>
          ))}
        </nav>

        {/* User profile + sign out */}
        {user && (
          <div className="border-t border-slate-100 p-3">
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold uppercase text-white">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="truncate text-xs text-slate-500">{user.email}</p>
                </div>
                <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${
                  user.role === "ADMIN"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}>
                  {user.role === "ADMIN" ? "Admin" : "Customer"}
                </span>
              </div>

              <button
                onClick={logout}
                className="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
