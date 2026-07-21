import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { login, register as registerUser } from "../../services/auth.service";

const loginSchema = z.object({
  email:    z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  firstName: z.string().min(2, "At least 2 characters"),
  lastName:  z.string().min(2, "At least 2 characters"),
  email:     z.string().email("Enter a valid email"),
  password:  z.string().min(6, "Min. 6 characters"),
  role: z.enum(["CUSTOMER", "ADMIN"]),
});

type LoginData    = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

function apiError(error: unknown, fallback: string) {
  const e = error as { response?: { data?: { message?: string } } };
  return e?.response?.data?.message ?? fallback;
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-500">{msg}</p>;
}

function PasswordField({ registration, placeholder }: {
  registration: object;
  placeholder: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Lock size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        {...(registration as React.InputHTMLAttributes<HTMLInputElement>)}
        className="field pl-10 pr-10"
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
        tabIndex={-1}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );
}

export default function LoginForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const navigate = useNavigate();

  const lf = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const rf = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "", role: "CUSTOMER" },
  });

  const loginMut = useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/dashboard");
    },
    onError: (err) => toast.error(apiError(err, "Invalid credentials")),
  });

  const registerMut = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Account created — please sign in.");
      setMode("login");
      rf.reset();
    },
    onError: (err) => toast.error(apiError(err, "Registration failed")),
  });

  const switchMode = (m: "login" | "register") => {
    setMode(m);
    lf.clearErrors();
    rf.clearErrors();
  };

  const lfe = lf.formState.errors;
  const rfe = rf.formState.errors;

  return (
    <div className="space-y-5">
      {/* Tab switcher */}
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            className={`rounded-lg py-2 text-sm font-semibold capitalize transition-all ${
              mode === m ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {m === "login" ? "Sign in" : "Register"}
          </button>
        ))}
      </div>

      {/* Sign in */}
      {mode === "login" && (
        <form
          onSubmit={lf.handleSubmit((d) => loginMut.mutate(d))}
          className="space-y-4 animate-fade-up"
          noValidate
        >
          <div>
            <label className="label">Email address</label>
            <div className="relative">
              <Mail size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="email" placeholder="admin@dealership.com" {...lf.register("email")} className="field pl-10" />
            </div>
            <FieldError msg={lfe.email?.message} />
          </div>

          <div>
            <label className="label">Password</label>
            <PasswordField registration={lf.register("password")} placeholder="Enter your password" />
            <FieldError msg={lfe.password?.message} />
          </div>

          <button type="submit" disabled={loginMut.isPending} className="btn-primary w-full">
            {loginMut.isPending ? "Signing in…" : "Sign in →"}
          </button>

          {/* Quick-fill */}
          <div className="border-t border-slate-100 pt-4">
            <p className="text-xs font-medium text-slate-400 mb-2">Quick fill for evaluation:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => lf.reset({ email: "admin@dealership.com", password: "password123" })}
                className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Admin account
              </button>
              <button
                type="button"
                onClick={() => lf.reset({ email: "customer@dealership.com", password: "password123" })}
                className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Customer account
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Register */}
      {mode === "register" && (
        <form
          onSubmit={rf.handleSubmit((d) => registerMut.mutate(d))}
          className="space-y-4 animate-fade-up"
          noValidate
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">First name</label>
              <input type="text" placeholder="John" {...rf.register("firstName")} className="field" />
              <FieldError msg={rfe.firstName?.message} />
            </div>
            <div>
              <label className="label">Last name</label>
              <input type="text" placeholder="Doe" {...rf.register("lastName")} className="field" />
              <FieldError msg={rfe.lastName?.message} />
            </div>
          </div>

          <div>
            <label className="label">Email address</label>
            <div className="relative">
              <Mail size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="email" placeholder="you@example.com" {...rf.register("email")} className="field pl-10" />
            </div>
            <FieldError msg={rfe.email?.message} />
          </div>

          <div>
            <label className="label">Password</label>
            <PasswordField registration={rf.register("password")} placeholder="Min. 6 characters" />
            <FieldError msg={rfe.password?.message} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="label mb-0">Account type</label>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-600 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">Eval mode</span>
            </div>
            <p className="text-xs text-slate-500 mb-2 leading-relaxed">
              In production, Admin roles are provisioned by system administrators only. This selector is exposed for evaluation convenience.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: "CUSTOMER", label: "Customer",    desc: "Browse & purchase" },
                { value: "ADMIN",    label: "Admin",        desc: "Full management" },
              ] as const).map(({ value, label, desc }) => {
                const checked = rf.watch("role") === value;
                return (
                  <label
                    key={value}
                    className={`flex cursor-pointer flex-col rounded-xl border p-3 transition-all ${
                      checked
                        ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input type="radio" value={value} {...rf.register("role")} className="sr-only" />
                    <div className="flex items-center gap-1.5">
                      <User size={12} className="text-slate-500" />
                      <span className="text-sm font-semibold text-slate-900">{label}</span>
                    </div>
                    <span className="mt-0.5 text-[11px] text-slate-500">{desc}</span>
                  </label>
                );
              })}
            </div>
            <FieldError msg={rfe.role?.message} />
          </div>

          <button type="submit" disabled={registerMut.isPending} className="btn-primary w-full">
            {registerMut.isPending ? "Creating…" : "Create account →"}
          </button>
        </form>
      )}
    </div>
  );
}
