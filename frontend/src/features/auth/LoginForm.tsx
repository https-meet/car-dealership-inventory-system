import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Lock, Mail, ShieldCheck, UserRound } from "lucide-react";
import { login, register as registerUser } from "../../services/auth.service";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  firstName: z.string().min(2, "Use at least 2 characters"),
  lastName: z.string().min(2, "Use at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Use at least 6 characters"),
  role: z.enum(["ADMIN", "CUSTOMER"]),
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;
type RegisterRole = RegisterData["role"];

function apiErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (error as { response?: { data?: { message?: string } } })
      .response;
    return response?.data?.message ?? fallback;
  }

  return fallback;
}

export default function LoginForm() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [selectedRole, setSelectedRole] = useState<RegisterRole>("CUSTOMER");
  const navigate = useNavigate();

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "CUSTOMER",
    },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/dashboard");
    },
    onError: (error: unknown) => {
      toast.error(apiErrorMessage(error, "Invalid credentials"));
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Account created. Please sign in.");
      setIsLoginMode(true);
      setSelectedRole("CUSTOMER");
      registerForm.reset();
    },
    onError: (error: unknown) => {
      toast.error(apiErrorMessage(error, "Registration failed"));
    },
  });

  const handleModeSwitch = (mode: boolean) => {
    setIsLoginMode(mode);
    loginForm.clearErrors();
    registerForm.clearErrors();
  };

  const roleField = registerForm.register("role");

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 rounded-lg bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => handleModeSwitch(true)}
          className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
            isLoginMode
              ? "bg-white text-slate-950 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => handleModeSwitch(false)}
          className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
            !isLoginMode
              ? "bg-white text-slate-950 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Register
        </button>
      </div>

      {isLoginMode ? (
        <form
          onSubmit={loginForm.handleSubmit((data) => loginMutation.mutate(data))}
          className="space-y-4"
          noValidate
        >
          <div>
            <label className="label">Email address</label>
            <div className="relative">
              <Mail
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                placeholder="admin@dealership.com"
                {...loginForm.register("email")}
                className="field pl-10"
              />
            </div>
            {loginForm.formState.errors.email && (
              <p className="mt-1.5 text-xs font-medium text-rose-600">
                {loginForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <Lock
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="password"
                placeholder="Enter your password"
                {...loginForm.register("password")}
                className="field pl-10"
              />
            </div>
            {loginForm.formState.errors.password && (
              <p className="mt-1.5 text-xs font-medium text-rose-600">
                {loginForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="btn-primary w-full"
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={registerForm.handleSubmit((data) =>
            registerMutation.mutate(data)
          )}
          className="space-y-4"
          noValidate
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">First name</label>
              <input
                type="text"
                placeholder="Aarav"
                {...registerForm.register("firstName")}
                className="field"
              />
              {registerForm.formState.errors.firstName && (
                <p className="mt-1.5 text-xs font-medium text-rose-600">
                  {registerForm.formState.errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <label className="label">Last name</label>
              <input
                type="text"
                placeholder="Shah"
                {...registerForm.register("lastName")}
                className="field"
              />
              {registerForm.formState.errors.lastName && (
                <p className="mt-1.5 text-xs font-medium text-rose-600">
                  {registerForm.formState.errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="label">Email address</label>
            <div className="relative">
              <Mail
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                placeholder="you@example.com"
                {...registerForm.register("email")}
                className="field pl-10"
              />
            </div>
            {registerForm.formState.errors.email && (
              <p className="mt-1.5 text-xs font-medium text-rose-600">
                {registerForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <Lock
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="password"
                placeholder="Create a password"
                {...registerForm.register("password")}
                className="field pl-10"
              />
            </div>
            {registerForm.formState.errors.password && (
              <p className="mt-1.5 text-xs font-medium text-rose-600">
                {registerForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="label">Account role</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "CUSTOMER", label: "Customer", icon: UserRound },
                { value: "ADMIN", label: "Admin", icon: ShieldCheck },
              ].map(({ value, label, icon: Icon }) => (
                <label
                  key={value}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                    selectedRole === value
                      ? "border-teal-300 bg-teal-50 text-teal-900"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    value={value}
                    className="sr-only"
                    name={roleField.name}
                    ref={roleField.ref}
                    onBlur={roleField.onBlur}
                    onChange={(event) => {
                      roleField.onChange(event);
                      setSelectedRole(event.target.value as RegisterRole);
                    }}
                  />
                  <Icon size={16} />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="btn-primary w-full"
          >
            {registerMutation.isPending ? "Creating account..." : "Create account"}
          </button>
        </form>
      )}
    </div>
  );
}
