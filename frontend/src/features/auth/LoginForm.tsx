import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { login, register as registerUser } from "../../services/auth.service";

// ── Schemas ──────────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email:    z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  firstName: z.string().min(2, "At least 2 characters"),
  lastName:  z.string().min(2, "At least 2 characters"),
  email:     z.string().email("Enter a valid email address"),
  password:  z.string().min(6, "At least 6 characters"),
  // NOTE: Role is intentionally exposed for demo/evaluation purposes only.
  // In a production system this would be provisioned server-side by admins.
  role: z.enum(["CUSTOMER", "ADMIN"]),
});

type LoginData    = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

function apiError(error: unknown, fallback: string) {
  const e = error as { response?: { data?: { message?: string } } };
  return e?.response?.data?.message ?? fallback;
}

// ── Sub-components ────────────────────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs font-medium text-red-500">{message}</p>;
}

function PasswordInput({ registration, placeholder }: {
  registration: ReturnType<ReturnType<typeof useForm>["register"]>;
  placeholder: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Lock size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        {...registration}
        className="field pl-10 pr-10"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
        tabIndex={-1}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function LoginForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const navigate = useNavigate();

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "", role: "CUSTOMER" },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/dashboard");
    },
    onError: (err) => toast.error(apiError(err, "Invalid email or password")),
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Account created – please sign in.");
      setMode("login");
      registerForm.reset();
    },
    onError: (err) => toast.error(apiError(err, "Registration failed")),
  });

  const switchMode = (m: "login" | "register") => {
    setMode(m);
    loginForm.clearErrors();
    registerForm.clearErrors();
  };

  const lf = loginForm.formState.errors;
  const rf = registerForm.formState.errors;

  return (
    <div className="space-y-6">
      {/* Mode switcher tabs */}
      <div className="flex rounded-xl bg-slate-100 p-1 gap-1">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold capitalize transition-all ${
              mode === m
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {m === "login" ? "Sign in" : "Register"}
          </button>
        ))}
      </div>

      {/* ── Sign In Form ── */}
      {mode === "login" && (
        <form
          onSubmit={loginForm.handleSubmit((d) => loginMutation.mutate(d))}
          className="space-y-4 animate-fade-in"
          noValidate
        >
          <div>
            <label className="label">Email address</label>
            <div className="relative">
              <Mail size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder="admin@dealership.com"
                {...loginForm.register("email")}
                className="field pl-10"
              />
            </div>
            <FieldError message={lf.email?.message} />
          </div>

          <div>
            <label className="label">Password</label>
            <PasswordInput
              registration={loginForm.register("password")}
              placeholder="Enter password"
            />
            <FieldError message={lf.password?.message} />
          </div>

          <button type="submit" disabled={loginMutation.isPending} className="btn-primary w-full mt-2">
            {loginMutation.isPending ? "Signing in…" : "Sign in"}
          </button>

          {/* Quick-fill demo buttons */}
          <div className="pt-1 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-2 font-medium">Quick demo login:</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => loginForm.reset({ email: "admin@dealership.com", password: "password123" })}
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => loginForm.reset({ email: "customer@dealership.com", password: "password123" })}
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Customer
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ── Register Form ── */}
      {mode === "register" && (
        <form
          onSubmit={registerForm.handleSubmit((d) => registerMutation.mutate(d))}
          className="space-y-4 animate-fade-in"
          noValidate
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">First name</label>
              <input type="text" placeholder="John" {...registerForm.register("firstName")} className="field" />
              <FieldError message={rf.firstName?.message} />
            </div>
            <div>
              <label className="label">Last name</label>
              <input type="text" placeholder="Doe" {...registerForm.register("lastName")} className="field" />
              <FieldError message={rf.lastName?.message} />
            </div>
          </div>

          <div>
            <label className="label">Email address</label>
            <div className="relative">
              <Mail size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="email" placeholder="you@example.com" {...registerForm.register("email")} className="field pl-10" />
            </div>
            <FieldError message={rf.email?.message} />
          </div>

          <div>
            <label className="label">Password</label>
            <PasswordInput registration={registerForm.register("password")} placeholder="Min. 6 characters" />
            <FieldError message={rf.password?.message} />
          </div>

          {/* Role selector – clearly labelled for evaluation/demo */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="label mb-0">Account type</label>
              <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
                Demo only
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-2">
              In production, Admin access is granted by system administrators only.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: "CUSTOMER", label: "Customer", desc: "Browse & purchase" },
                { value: "ADMIN",    label: "Admin",    desc: "Full access" },
              ] as const).map(({ value, label, desc }) => (
                <label
                  key={value}
                  className={`flex cursor-pointer flex-col rounded-xl border p-3 transition-all ${
                    registerForm.watch("role") === value
                      ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <input type="radio" value={value} {...registerForm.register("role")} className="sr-only" />
                  <div className="flex items-center gap-2">
                    <User size={13} className="text-slate-600" />
                    <span className="text-sm font-semibold text-slate-900">{label}</span>
                  </div>
                  <span className="mt-0.5 text-[11px] text-slate-500">{desc}</span>
                </label>
              ))}
            </div>
            <FieldError message={rf.role?.message} />
          </div>

          <button type="submit" disabled={registerMutation.isPending} className="btn-primary w-full mt-2">
            {registerMutation.isPending ? "Creating account…" : "Create account"}
          </button>
        </form>
      )}
    </div>
  );
}
