import { LayoutDashboard, Car, ShoppingCart, BarChart3, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const menu = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Vehicles",
    path: "/vehicles",
    icon: Car,
  },
  {
    name: "Purchases",
    path: "/purchases",
    icon: ShoppingCart,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: BarChart3,
  },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="text-2xl font-bold p-6 border-b border-slate-700">
        Car Dealer
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-600"
                    : "hover:bg-slate-800"
                }`
              }
            >
              <Icon size={20} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={logout}
        className="m-4 flex items-center gap-2 rounded-lg bg-red-600 p-3 hover:bg-red-700"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}