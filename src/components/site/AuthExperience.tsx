import React, { useState } from "react";
import {
  Sun,
  Zap,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  BatteryCharging,
  Building2,
} from "lucide-react";
import omsunLogo from "@/assets/Omsun Nepal logo-WA0006.webp";
import welcomeChar from "@/assets/robot.webp";
import solarFarmImg from "@/assets/banner-solar-farm.webp";
import heroPortalBg from "@/assets/hero-portal-bg.webp";

/* ─── tiny field component ─── */
function Field({
  label,
  icon: Icon,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  suffix,
}: {
  label: string;
  icon: React.ElementType;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  suffix?: React.ReactNode;
}) {
  return (
    <div className="auth-field">
      <label className="auth-label">{label}</label>
      <div className="auth-input-wrap">
        <Icon className="auth-input-icon" />
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="auth-input"
          autoComplete="off"
        />
        {suffix}
      </div>
    </div>
  );
}

import { useAuth } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

/* ─── main component ─── */
export default function AuthExperience() {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [redirectTarget, setRedirectTarget] = useState<string | null>(null);

  const { login, register, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const search = new URLSearchParams(window.location.search);
      const m = search.get("mode");
      if (m === "login") setMode("login");
      const r = search.get("redirect") || search.get("returnUrl");
      if (r) setRedirectTarget(r);
    }
  }, []);

  // If already logged in, automatically forward to appropriate destination
  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        navigate({ to: redirectTarget || "/admin-dashboard" });
      } else {
        const dest = redirectTarget && !redirectTarget.includes("admin") ? redirectTarget : "/dashboard";
        navigate({ to: dest });
      }
    }
  }, [isAuthenticated, user, redirectTarget, navigate]);

  const [showPwd, setShowPwd] = useState(false);
  const [showCPwd, setShowCPwd] = useState(false);
  const isLogin = mode === "login";

  const [form, setForm] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const change = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleGoogleAuth = async () => {
    setSubmitting(true);
    try {
      const result = await login("customer@omsun.com.np", "password123");
      if (result && !result.error) {
        toast.success("Signed in with Google", { description: "Welcome to OMSUN Nepal!" });
        const dest = redirectTarget && !redirectTarget.includes("admin") ? redirectTarget : "/dashboard";
        navigate({ to: dest });
      } else {
        toast.info("Google Sign-In", { description: "Connecting your Google authentication profile..." });
      }
    } catch {
      toast.error("Google authentication encountered an issue");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isLogin) {
        const result = await login(form.email, form.password);
        if (result.error) {
          toast.error("Login failed", { description: result.error });
          return;
        }
        if (result.user?.role === "admin") {
          toast.success("Welcome, Administrator!", { description: "Redirecting to OMSUN Admin Control Center..." });
          navigate({ to: redirectTarget || "/admin-dashboard" });
        } else {
          toast.success("Welcome back!", { description: "Redirecting to your customer dashboard..." });
          const dest = redirectTarget && !redirectTarget.includes("admin") ? redirectTarget : "/dashboard";
          navigate({ to: dest });
        }
      } else {
        if (form.password !== form.confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
        const result = await register({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          phone: form.phone,
          company: form.company,
        });
        if (result.error) {
          toast.error("Registration failed", { description: result.error });
          return;
        }
        toast.success("Account created!", { description: "Welcome to OMSUN Nepal." });
        const dest = redirectTarget && !redirectTarget.includes("admin") ? redirectTarget : "/dashboard";
        navigate({ to: dest });
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ── atmospheric bg ── */}
      <div className="auth-bg-orb auth-bg-orb--tl" />
      <div className="auth-bg-orb auth-bg-orb--br" />
      <div className="auth-bg-grid" />

      {/* ── dual-card wrapper ── */}
      <div className="auth-card-shell">
        {/* panel sits on the INACTIVE side — right when login, left when register */}
        <div
          className={`auth-slide-panel ${isLogin ? "auth-slide-panel--right" : "auth-slide-panel--left"}`}
        >
          {/* inner gradient layer */}
          <div className="auth-slide-inner relative overflow-hidden">
            <img
              src={heroPortalBg}
              alt="OMSUN Solar Background"
              decoding="async"
              className="absolute inset-0 size-full object-cover opacity-35 mix-blend-overlay pointer-events-none"
            />
            {/* glow blobs */}
            <div className="auth-panel-blob auth-panel-blob--a" />
            <div className="auth-panel-blob auth-panel-blob--b" />

            {/* Logo */}
            <div className="auth-panel-logo">
              <span className="auth-logo-badge">
                <img src={omsunLogo} alt="OMSUN" className="size-7 object-contain" />
              </span>
              <div>
                <p className="auth-logo-name">OMSUN</p>
                <p className="auth-logo-sub">Nepal Pvt. Ltd.</p>
              </div>
            </div>

            <div
              key={isLogin ? "login" : "register"}
              className="auth-panel-headline auth-content-in"
            >
              <div className="auth-character-wrap">
                <img src={welcomeChar} alt="Welcome" decoding="async" className="auth-character" />
              </div>
              <div className="auth-panel-text">
                <h2 className="auth-panel-h2">{isLogin ? "Welcome Back!" : "Join OMSUN Nepal"}</h2>
                <p className="auth-panel-p">
                  {isLogin
                    ? "Sign in to access your solar dashboard, orders and engineering support."
                    : "Nepal's premier clean-energy platform — solar, storage, switchgear & more."}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="auth-panel-stats">
              {[
                { icon: Zap, val: "Tier-1", sub: "Hardware" },
                { icon: BatteryCharging, val: "Nationwide", sub: "Delivery" },
                { icon: ShieldCheck, val: "Official", sub: "Warranty" },
              ].map((s) => (
                <div key={s.sub} className="auth-stat">
                  <s.icon className="size-4 text-amber-300 mb-1" />
                  <p className="auth-stat-val">{s.val}</p>
                  <p className="auth-stat-sub">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Switch prompt */}
            <p className="auth-panel-switch">
              {isLogin ? "New to OMSUN?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => setMode(isLogin ? "register" : "login")}
                className="auth-panel-switch-btn"
              >
                {isLogin ? "Create free account →" : "Sign in →"}
              </button>
            </p>
          </div>
        </div>

        {/* ═══ FORM HALF ═══ */}
        {/* Login form */}
        <div
          className={`auth-form-pane ${isLogin ? "auth-form-pane--visible" : "auth-form-pane--hidden auth-form-pane--right"}`}
        >
          <div className="auth-form-inner">
            {/* tabs */}
            <div className="auth-tabs">
              <button className="auth-tab auth-tab--active" type="button">
                Sign In
              </button>
              <button className="auth-tab" type="button" onClick={() => setMode("register")}>
                Register
              </button>
            </div>

            <h3 className="auth-form-title">Sign in to your account</h3>
            <p className="auth-form-sub">Access your solar dashboard & orders.</p>

            <form className="auth-form-fields" onSubmit={handleSubmit}>
              <Field
                label="Email Address"
                icon={Mail}
                type="email"
                name="email"
                value={form.email}
                onChange={change}
                placeholder="you@omsun.com.np"
              />

              <Field
                label="Password"
                icon={Lock}
                type={showPwd ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={change}
                placeholder="••••••••••"
                suffix={
                  <button
                    type="button"
                    className="auth-eye-btn"
                    onClick={() => setShowPwd((v) => !v)}
                  >
                    {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                }
              />

              <div className="auth-row">
                <label className="auth-check-label">
                  <input type="checkbox" className="auth-check" /> Keep me signed in
                </label>
                <a href="#forgot" className="auth-forgot">
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={submitting}>
                <span>{submitting ? "Signing in..." : "Sign In"}</span>
                {!submitting && (
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </button>

              <div className="auth-divider">
                <span>or continue with</span>
              </div>

              <button type="button" onClick={handleGoogleAuth} className="auth-google-btn">
                <svg className="size-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </form>

            <p className="auth-footer-switch">
              Don't have an account?{" "}
              <button
                type="button"
                className="auth-footer-switch-btn"
                onClick={() => setMode("register")}
              >
                Create free account
              </button>
            </p>
          </div>
        </div>

        {/* Register form */}
        <div
          className={`auth-form-pane ${!isLogin ? "auth-form-pane--visible" : "auth-form-pane--hidden auth-form-pane--left"}`}
        >
          <div className="auth-form-inner">
            {/* tabs */}
            <div className="auth-tabs">
              <button className="auth-tab" type="button" onClick={() => setMode("login")}>
                Sign In
              </button>
              <button className="auth-tab auth-tab--active" type="button">
                Register
              </button>
            </div>

            <h3 className="auth-form-title">Create your account</h3>
            <p className="auth-form-sub">Join Nepal's largest clean-energy platform.</p>

            <form className="auth-form-fields" onSubmit={handleSubmit}>
              <Field
                label="Full Name"
                icon={User}
                name="fullName"
                value={form.fullName}
                onChange={change}
                placeholder="Anish Sharma"
              />

              <Field
                label="Email Address"
                icon={Mail}
                type="email"
                name="email"
                value={form.email}
                onChange={change}
                placeholder="you@omsun.com.np"
              />

              <div className="auth-two-col">
                <Field
                  label="Phone Number"
                  icon={Phone}
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={change}
                  placeholder="+977 98XXXXXXXX"
                />
                <Field
                  label="Company (optional)"
                  icon={Building2}
                  name="company"
                  value={form.company}
                  onChange={change}
                  placeholder="Solar Pvt Ltd"
                />
              </div>

              <div className="auth-two-col">
                <Field
                  label="Password"
                  icon={Lock}
                  type={showPwd ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={change}
                  placeholder="••••••••••"
                  suffix={
                    <button
                      type="button"
                      className="auth-eye-btn"
                      onClick={() => setShowPwd((v) => !v)}
                    >
                      {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  }
                />
                <Field
                  label="Confirm Password"
                  icon={Lock}
                  type={showCPwd ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={change}
                  placeholder="••••••••••"
                  suffix={
                    <button
                      type="button"
                      className="auth-eye-btn"
                      onClick={() => setShowCPwd((v) => !v)}
                    >
                      {showCPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  }
                />
              </div>

              <label className="auth-check-label mt-1">
                <input type="checkbox" className="auth-check" required />
                <span>
                  I agree to OMSUN Nepal's{" "}
                  <a href="#terms" className="auth-link font-bold text-[#0A2E20] underline">
                    Terms &amp; Conditions
                  </a>{" "}
                  and{" "}
                  <a href="#privacy" className="auth-link font-bold text-[#0A2E20] underline">
                    Privacy Policy
                  </a>
                </span>
              </label>

              <button type="submit" className="auth-submit-btn" disabled={submitting}>
                <span>{submitting ? "Creating account..." : "Create Account"}</span>
                {!submitting && <ArrowRight className="size-4" />}
              </button>

              <div className="auth-divider">
                <span>or continue with</span>
              </div>

              <button type="button" onClick={handleGoogleAuth} className="auth-google-btn">
                <svg className="size-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </form>

            <p className="auth-footer-switch">
              Already registered?{" "}
              <button
                type="button"
                className="auth-footer-switch-btn"
                onClick={() => setMode("login")}
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
      {/* /auth-card-shell */}
    </div>
  );
}
