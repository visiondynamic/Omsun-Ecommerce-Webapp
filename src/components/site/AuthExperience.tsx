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
import welcomeChar from "@/assets/robot.png";

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

/* ─── main component ─── */
export default function AuthExperience() {
  const [mode, setMode] = useState<"login" | "register">(() => {
    if (typeof window !== "undefined") {
      const search = new URLSearchParams(window.location.search);
      const m = search.get("mode");
      if (m === "login") return "login";
    }
    return "register";
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showCPwd, setShowCPwd] = useState(false);
  const isLogin = mode === "login";

  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const change = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Determine role based on email for demonstration purposes
    const role = form.email.toLowerCase().includes("admin") ? "admin" : "customer";

    login(form.email, role);

    // Redirect based on role
    if (role === "admin") {
      navigate({ to: "/admin-dashboard" });
    } else {
      navigate({ to: "/dashboard" });
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
          <div className="auth-slide-inner">
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

            <div className="auth-panel-headline">
              <div className="auth-character-wrap">
                <img src={welcomeChar} alt="Welcome" className="auth-character" />
              </div>
              <h2 className="auth-panel-h2">{isLogin ? "Welcome Back!" : "Join OMSUN Nepal"}</h2>
              <p className="auth-panel-p">
                {isLogin
                  ? "Sign in to access your solar dashboard, orders and engineering support."
                  : "Nepal's premier clean-energy platform — solar, storage, switchgear & more."}
              </p>
            </div>

            {/* Stats */}
            <div className="auth-panel-stats">
              {[
                { icon: Zap, val: "18 MW+", sub: "Installed" },
                { icon: BatteryCharging, val: "4,200+", sub: "Projects" },
                { icon: ShieldCheck, val: "25 yr", sub: "Warranty" },
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

              <button type="submit" className="auth-submit-btn">
                <span>Sign In</span>
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <div className="auth-divider">
                <span>or continue with</span>
              </div>

              <div className="auth-social-row">
                <button type="button" className="auth-social-btn">
                  <svg className="size-4" viewBox="0 0 24 24">
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
                  Google
                </button>
                <button type="button" className="auth-social-btn">
                  <svg className="size-4 text-[#0078D4]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" />
                  </svg>
                  Microsoft
                </button>
              </div>
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
              <div className="auth-two-col">
                <Field
                  label="Full Name"
                  icon={User}
                  name="fullName"
                  value={form.fullName}
                  onChange={change}
                  placeholder="Anish Sharma"
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
                label="Phone Number"
                icon={Phone}
                type="tel"
                name="phone"
                value={form.phone}
                onChange={change}
                placeholder="+977 98XXXXXXXX"
              />

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
                <input type="checkbox" className="auth-check" required />I agree to OMSUN Nepal's{" "}
                <a href="#terms" className="auth-link">
                  Terms
                </a>{" "}
                &amp;{" "}
                <a href="#privacy" className="auth-link">
                  Privacy Policy
                </a>
              </label>

              <button type="submit" className="auth-submit-btn">
                <span>Create Account</span>
                <ArrowRight className="size-4" />
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
