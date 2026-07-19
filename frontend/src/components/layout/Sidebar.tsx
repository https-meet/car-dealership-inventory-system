import {
  LayoutDashboard,
  Car,
  ShoppingCart,
  BarChart3,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ALL_MENU = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "CUSTOMER"] as const,
  },
  {
    name: "Vehicles",
    path: "/vehicles",
    icon: Car,
    roles: ["ADMIN", "CUSTOMER"] as const,
  },
  {
    name: "Purchases",
    path: "/purchases",
    icon: ShoppingCart,
    roles: ["ADMIN", "CUSTOMER"] as const,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: BarChart3,
    roles: ["ADMIN"] as const, // ADMIN only
  },
];

export default function Sidebar() {
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
    <aside className="w-64 bg-slate-900 text-white flex flex-col">
      {/* Brand */}
      <div className="border-b border-slate-700 px-6 py-5">
        <p className="text-xl font-bold tracking-tight">Car Dealer</p>
        {user && (
          <p className="mt-1 text-xs text-slate-400">
            Welcome, {user.firstName}
          </p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        className="m-4 flex items-center gap-2 rounded-lg bg-red-600/20 px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-600 hover:text-white transition-colors"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}