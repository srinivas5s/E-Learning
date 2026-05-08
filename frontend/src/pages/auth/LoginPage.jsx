import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authApi from "../../api/auth.api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [redirecting, setRedirecting] = useState(false);

    const validate = () => {
        const e = {};
        if (!form.email.trim()) e.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
        if (!form.password) e.password = "Password is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // Clear error the moment user starts typing
    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
        if (apiError) setApiError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setApiError("");

        try {
            const res = await authApi.login(form);
            const { user, accessToken } = res.data.data;
            setRedirecting(true);
            login(user, accessToken);
            setTimeout(() => navigate(from, { replace: true }), 1400);
        } catch {
            setLoading(false);
            setApiError("Invalid credentials. Please check your email and password.");
        }
    };

    // ── Success screen ────────────────────────────────────────────────────────
    if (redirecting) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-5"
                style={{ backgroundColor: "var(--color-bg)" }}>

                <div className="relative flex items-center justify-center w-20 h-20">
                    <div className="absolute inset-0 rounded-full animate-ping opacity-20"
                        style={{ backgroundColor: "var(--color-primary)" }} />
                    <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
                        style={{ borderColor: "var(--color-primary)", borderTopColor: "transparent" }} />
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl z-10"
                        style={{ backgroundColor: "rgba(99,102,241,0.15)" }}>
                        ✅
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-lg font-bold mb-1"
                        style={{ color: "var(--color-text-heading)", fontFamily: "var(--font-heading)" }}>
                        Login Successful!
                    </p>
                    <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                        Redirecting you now…
                    </p>
                </div>

                <div className="w-48 h-1 rounded-full overflow-hidden"
                    style={{ backgroundColor: "var(--color-border)" }}>
                    <div className="h-full rounded-full"
                        style={{
                            backgroundColor: "var(--color-primary)",
                            animation: "progressFill 1.3s ease forwards",
                        }} />
                </div>

                <style>{`
                    @keyframes progressFill {
                        from { width: 0%; }
                        to   { width: 100%; }
                    }
                `}</style>
            </div>
        );
    }

    // ── Login form ────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10"
            style={{ backgroundColor: "var(--color-bg)" }}>

            {/* Autofill dark mode fix */}
            <style>{`
                input:-webkit-autofill,
                input:-webkit-autofill:hover,
                input:-webkit-autofill:focus,
                input:-webkit-autofill:active {
                    -webkit-box-shadow: 0 0 0px 1000px var(--color-bg-input) inset !important;
                    -webkit-text-fill-color: var(--color-text) !important;
                    caret-color: var(--color-text) !important;
                    transition: background-color 9999s ease-in-out 0s;
                }
            `}</style>

            <div className="auth-card w-full">

                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
                        style={{ backgroundColor: "rgba(99,102,241,0.15)" }}>
                        <span className="text-2xl">👋</span>
                    </div>
                    <h1 className="text-2xl font-bold"
                        style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}>
                        Welcome Back
                    </h1>
                    <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                        Sign in to continue learning
                    </p>
                </div>

                {/* Error banner */}
                {apiError && (
                    <div
                        className="mb-5 px-4 py-3.5 rounded-xl flex items-start gap-3"
                        style={{
                            backgroundColor: "rgba(248,113,113,0.08)",
                            border: "1px solid rgba(248,113,113,0.3)",
                        }}
                    >
                        <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: "rgba(248,113,113,0.15)" }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                                stroke="#f87171" strokeWidth="2.5" strokeLinecap="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold mb-0.5" style={{ color: "#f87171" }}>
                                Login failed
                            </p>
                            <p className="text-xs" style={{ color: "#fca5a5" }}>
                                {apiError}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setApiError("")}
                            className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
                            style={{ color: "#f87171" }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                    {/* Email */}
                    <div>
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <input
                            id="email" name="email" type="email"
                            className="input-field"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            style={errors.email ? {
                                borderColor: "var(--color-error)",
                                boxShadow: "0 0 0 3px rgba(248,113,113,0.12)",
                            } : {}}
                        />
                        {errors.email && <p className="error-msg">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="form-label mb-0!" htmlFor="password">Password</label>
                            <Link to="/forgot-password" className="text-xs hover:underline"
                                style={{ color: "var(--color-primary)" }}>
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <input
                                id="password" name="password"
                                type={showPass ? "text" : "password"}
                                className="input-field pr-16"
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={handleChange}
                                style={errors.password ? {
                                    borderColor: "var(--color-error)",
                                    boxShadow: "0 0 0 3px rgba(248,113,113,0.12)",
                                } : {}}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium"
                                style={{ color: "var(--color-text-muted)" }}
                            >
                                {showPass ? "Hide" : "Show"}
                            </button>
                        </div>
                        {errors.password && <p className="error-msg">{errors.password}</p>}
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full">
                        {loading
                            ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            : "Sign In"}
                    </button>
                </form>

                <p className="text-center text-sm mt-6" style={{ color: "var(--color-text-muted)" }}>
                    Don't have an account?{" "}
                    <Link to="/register" className="font-semibold hover:underline"
                        style={{ color: "var(--color-primary)" }}>
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;