import {
  LayoutDashboard,
  Car,
  ShoppingCart,
  BarChart3,
  LogOut,
  X,
  Store,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ALL_MENU = [
  {
    name: "Overview",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "CUSTOMER"] as const,
  },
  {
    name: "Inventory",
    path: "/vehicles",
    icon: Car,
    roles: ["ADMIN", "CUSTOMER"] as const,
  },
  {
    name: "Transactions",
    path: "/purchases",
    icon: ShoppingCart,
    roles: ["ADMIN", "CUSTOMER"] as const,
  },
  {
    name: "Analytics",
    path: "/reports",
    icon: BarChart3,
    roles: ["ADMIN"] as const,
  },
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
      {isOpen && (
        <button
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm md:hidden"
          aria-label="Close menu overlay"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-white/80 bg-white/85 px-3 py-4 shadow-xl shadow-slate-950/10 backdrop-blur-xl transition-transform duration-300 md:static md:translate-x-0 md:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-5 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="mesh-panel flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg shadow-teal-950/20">
              <Store size={21} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-950">Kata Inventory</p>
              <p className="text-xs font-medium text-slate-500">Car dealership</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="icon-button md:hidden"
            aria-label="Close menu"
          >
            <X size={17} />
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-teal-50 text-teal-900 ring-1 ring-teal-100"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`
                }
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {user && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-sm font-bold uppercase text-slate-800 shadow-sm">
                {user.firstName[0]}
                {user.lastName[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-950">
                  {user.firstName} {user.lastName}
                </p>
                <p className="truncate text-xs text-slate-500">{user.email}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
