import { Navigate } from "react-router-dom";
import {
  Car,
  ChartColumnIncreasing,
  Gauge,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import LoginForm from "../features/auth/LoginForm";
import { useAuth } from "../hooks/useAuth";

const previewVehicles = [
  { make: "Tesla", model: "Model 3", stock: "12 in stock", tone: "from-sky-400 to-cyan-300" },
  { make: "BMW", model: "X5", stock: "3 left", tone: "from-amber-400 to-orange-300" },
  { make: "Tata", model: "Nexon EV", stock: "Ready", tone: "from-teal-400 to-emerald-300" },
];

export default function LoginPage() {
  const user = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="app-bg min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl items-center gap-8 lg:grid-cols-[1fr_460px]">
        <section className="hidden lg:block">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-teal-800 shadow-sm backdrop-blur">
              <ShieldCheck size={14} />
              Protected inventory workspace
            </div>

            <h1 className="max-w-3xl text-6xl font-black leading-[0.95] tracking-tight text-slate-950">
              Kata - Car Dealership Inventory System
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600">
              A modern showroom and admin console for vehicle listings, stock
              control, purchases, and inventory reporting.
            </p>
          </div>

          <div className="mt-10 grid max-w-4xl grid-cols-[1.2fr_0.8fr] gap-5">
            <div className="mesh-panel overflow-hidden rounded-3xl p-5 text-white shadow-2xl shadow-teal-950/25">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-100">
                    Showroom preview
                  </p>
                  <h2 className="mt-2 text-2xl font-black">Live inventory</h2>
                </div>
                <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/20">
                  <Sparkles size={22} />
                </div>
              </div>

              <div className="mt-7 space-y-3">
                {previewVehicles.map((vehicle, index) => (
                  <div
                    key={`${vehicle.make}-${vehicle.model}`}
                    className="animate-rise-in rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur"
                    style={{ animationDelay: `${index * 90}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-16 rounded-2xl bg-gradient-to-br ${vehicle.tone} shadow-lg`} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">
                          {vehicle.make} {vehicle.model}
                        </p>
                        <p className="mt-1 text-xs font-medium text-teal-50/80">
                          {vehicle.stock}
                        </p>
                      </div>
                      <div className="h-2 w-20 overflow-hidden rounded-full bg-white/15">
                        <div className="h-full w-2/3 rounded-full bg-teal-200" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {[
                { label: "Vehicles", value: "Catalog", icon: Car },
                { label: "Stock status", value: "Inventory", icon: Gauge },
                { label: "Admin reports", value: "Analytics", icon: ChartColumnIncreasing },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="premium-surface p-4">
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                    <Icon size={19} />
                  </div>
                  <p className="text-sm font-bold text-slate-950">{value}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[460px] animate-rise-in">
          <div className="mb-7 text-center lg:text-left">
            <div className="mesh-panel mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg shadow-teal-950/20 lg:mx-0">
              <Car size={25} />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
              Kata Inventory
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Welcome back
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Sign in or create an account to manage the dealership.
            </p>
          </div>

          <div className="premium-surface p-5 sm:p-6">
            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}
