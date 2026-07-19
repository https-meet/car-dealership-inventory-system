import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const user = useAuth();

  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
      <h1 className="text-lg font-semibold text-slate-800">
        Car Dealership Inventory System
      </h1>

      {user && (
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-800">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>

          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              user.role === "ADMIN"
                ? "bg-blue-100 text-blue-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {user.role}
          </span>
        </div>
      )}
    </header>
  );
}