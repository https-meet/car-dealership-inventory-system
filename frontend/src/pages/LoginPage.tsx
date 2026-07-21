import { Navigate } from "react-router-dom";
import { Car, ShieldCheck, Users, BarChart3, TrendingUp } from "lucide-react";
import LoginForm from "../features/auth/LoginForm";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const user = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen flex bg-white">

      {/* ── Left branding panel ─────────────────────────── */}
      <div
        className="hidden lg:flex w-[480px] shrink-0 flex-col justify-between p-10 text-white"
        style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e293b 60%, #0f4c3a 100%)" }}
      >
        {/* Logo */}
        <div>
          <div className="flex items-center gap-3 mb-14">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/15 shrink-0">
              <Car size={20} />
            </div>
            <div className="leading-snug">
              <p className="text-sm font-bold">Kata: Car Dealership</p>
              <p className="text-xs text-slate-400 font-medium">Inventory System</p>
            </div>
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight mb-5">
            The modern dealership<br />management platform.
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            Manage vehicles, track inventory levels, record customer purchases, and generate analytics — all from a single protected workspace.
          </p>

          {/* Feature list */}
          <div className="mt-10 space-y-5">
            {[
              { icon: Car,         t: "Vehicle Catalog",       d: "Add, edit, and retire vehicle listings" },
              { icon: ShieldCheck, t: "Role-Based Security",   d: "JWT-protected endpoints per user role" },
              { icon: Users,       t: "Purchase Tracking",     d: "Every transaction logged per customer" },
              { icon: BarChart3,   t: "Admin Analytics",       d: "Revenue, stock health, and top sellers" },
              { icon: TrendingUp,  t: "Real-time Inventory",   d: "Live stock count on every purchase" },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="flex items-start gap-3.5">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/8 border border-white/10">
                  <Icon size={15} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{t}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System version */}
        <p className="text-xs text-slate-500 font-medium">
          Kata: Car Dealership Inventory System &copy; {new Date().getFullYear()}
        </p>
      </div>

      {/* ── Right form panel ────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-[420px] animate-fade-up">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shrink-0">
              <Car size={17} />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-slate-900">Kata: Car Dealership</p>
              <p className="text-xs text-slate-500">Inventory System</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sign in to your workspace</h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter your credentials to access the inventory dashboard.
            </p>
          </div>

          {/* Form card */}
          <div className="card-raised p-7">
            <LoginForm />
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Kata: Car Dealership Inventory System &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
