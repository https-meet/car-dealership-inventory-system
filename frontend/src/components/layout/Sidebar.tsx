import {
  LayoutDashboard, Car, ShoppingCart, BarChart3, LogOut, X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const NAV = [
  { label: "Overview",     path: "/dashboard", icon: LayoutDashboard, roles: ["ADMIN", "CUSTOMER"] },
  { label: "Inventory",    path: "/vehicles",  icon: Car,             roles: ["ADMIN", "CUSTOMER"] },
  { label: "Transactions", path: "/purchases", icon: ShoppingCart,    roles: ["ADMIN", "CUSTOMER"] },
  { label: "Analytics",    path: "/reports",   icon: BarChart3,       roles: ["ADMIN"] },
];

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const user = useAuth();

  const menu = NAV.filter(n => user && n.roles.includes(user.role));

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white
          transition-transform duration-300 ease-in-out
          md:static md:z-auto md:translate-x-0
          ${isOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"}
        `}
      >
        {/* Brand header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Car size={15} />
            </div>
            <div className="leading-tight min-w-0">
              <p className="text-[13px] font-bold text-slate-900 truncate">Kata Inventory</p>
              <p className="text-[10px] text-slate-400 font-medium">Car Dealership System</p>
            </div>
          </div>
          <button onClick={onClose} className="icon-btn md:hidden shrink-0" aria-label="Close sidebar">
            <X size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Navigation</p>
          <div className="space-y-0.5">
            {menu.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User footer */}
        {user && (
          <div className="border-t border-slate-100 p-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[11px] font-bold uppercase text-white">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="truncate text-[11px] text-slate-500">{user.email}</p>
                </div>
                <span className={`shrink-0 text-[10px] font-bold rounded-full px-2 py-0.5 ${
                  user.role === "ADMIN" ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-700"
                }`}>
                  {user.role === "ADMIN" ? "Admin" : "Customer"}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
