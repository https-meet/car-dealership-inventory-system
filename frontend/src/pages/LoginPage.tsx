import { Navigate } from "react-router-dom";
import { Car, ShieldCheck, Users, BarChart3, CheckCircle } from "lucide-react";
import LoginForm from "../features/auth/LoginForm";
import { useAuth } from "../hooks/useAuth";

const FEATURES = [
  { icon: Car,         label: "Vehicle Catalog",       desc: "Browse and manage full inventory" },
  { icon: ShieldCheck, label: "Role-Based Access",      desc: "Admin & Customer role protection" },
  { icon: Users,       label: "Purchase Management",    desc: "Track all customer transactions" },
  { icon: BarChart3,   label: "Analytics & Reports",    desc: "Revenue, stock, and top sellers" },
];

export default function LoginPage() {
  const user = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel – branding & feature list */}
      <div className="hidden lg:flex w-[480px] shrink-0 flex-col justify-between bg-slate-900 p-10 text-white">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/15">
              <Car size={20} />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">Kata: Car Dealership</p>
              <p className="text-xs text-slate-400 font-medium">Inventory System</p>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight leading-tight mb-4">
            Manage your dealership with confidence.
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            A full-stack inventory platform built for modern car dealerships. Stock control, purchases, and analytics in one place.
          </p>

          {/* Feature list */}
          <div className="mt-10 space-y-4">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/8 border border-white/10">
                  <Icon size={15} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo credentials */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Demo Credentials</p>
          {[
            { role: "Admin",    email: "admin@dealership.com",    pass: "password123" },
            { role: "Customer", email: "customer@dealership.com", pass: "password123" },
          ].map(({ role, email, pass }) => (
            <div key={role} className="flex items-center gap-3">
              <CheckCircle size={14} className="text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white">{role}: </span>
                <span className="text-xs text-slate-300">{email}</span>
                <span className="text-xs text-slate-500"> / {pass}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel – auth form */}
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-[420px] animate-fade-in">
          
          {/* Mobile-only logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Car size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-tight">Kata: Car Dealership</p>
              <p className="text-xs text-slate-500">Inventory System</p>
            </div>
          </div>

          {/* Form header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="mt-1 text-sm text-slate-500">Sign in to your account or create a new one.</p>
          </div>

          {/* Form card */}
          <div className="surface-elevated p-6 sm:p-8">
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
