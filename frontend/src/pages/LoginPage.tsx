import LoginForm from "../features/auth/LoginForm";
import { Car, Shield, BarChart3 } from "lucide-react";

const features = [
  { icon: Car, text: "Complete vehicle inventory management" },
  { icon: Shield, text: "Role-based access control (Admin & Customer)" },
  { icon: BarChart3, text: "Real-time sales reports & analytics" },
];

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-12 py-14 text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
            <Car size={22} />
          </div>
          <span className="text-lg font-bold">Car Dealership</span>
        </div>

        {/* Copy */}
        <div className="relative space-y-6">
          <h2 className="text-4xl font-bold leading-tight">
            Manage your entire dealership from one place
          </h2>
          <p className="text-slate-400">
            Track inventory, process purchases, and generate reports — all in a single streamlined platform.
          </p>

          <ul className="space-y-3">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600/30 text-blue-400">
                  <Icon size={14} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer note */}
        <p className="relative text-xs text-slate-600">
          &copy; {new Date().getFullYear()} Car Dealership Inventory System
        </p>
      </div>

      {/* Right panel — login form */}
      <div className="flex flex-1 items-center justify-center bg-slate-50 px-6 py-12">
        <LoginForm />
      </div>
    </div>
  );
}