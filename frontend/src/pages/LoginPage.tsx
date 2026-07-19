import { Navigate } from "react-router-dom";
import { Car, ChartColumnIncreasing, Gauge, ShieldCheck } from "lucide-react";
import LoginForm from "../features/auth/LoginForm";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const user = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fafc_0%,#f5f5f4_52%,#e7f4ef_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_440px]">
        <section className="hidden lg:block">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-teal-800 shadow-sm">
              <ShieldCheck size={14} />
              Secure vehicle inventory workspace
            </div>

            <h1 className="max-w-xl text-5xl font-bold tracking-tight text-slate-950">
              DealerDrive Inventory
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
              A responsive showroom and admin console for vehicle listings,
              stock control, purchase tracking, and sales reporting.
            </p>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-4">
            {[
              { label: "Live catalog", value: "Vehicles", icon: Car },
              { label: "Stock status", value: "Inventory", icon: Gauge },
              { label: "Admin reports", value: "Analytics", icon: ChartColumnIncreasing },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="soft-surface p-4">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white">
                  <Icon size={19} />
                </div>
                <p className="text-sm font-semibold text-slate-950">{value}</p>
                <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[440px]">
          <div className="mb-7 text-center lg:text-left">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-950 text-white shadow-sm lg:mx-0">
              <Car size={24} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              DealerDrive
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Sign in or create an account to continue.
            </p>
          </div>

          <div className="surface p-5 sm:p-6">
            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}
