import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authApi from "../../api/auth.api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect to the page they tried to visit, or home
    const from = location.state?.from?.pathname || "/";

    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const validate = () => {
        const e = {};
        if (!form.email.trim()) e.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
        if (!form.password) e.password = "Password is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
        setApiError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const res = await authApi.login(form);
            const { user, accessToken } = res.data.data;
            login(user, accessToken);
            navigate(from, { replace: true });
        } catch (err) {
            setApiError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10"
            style={{ backgroundColor: "var(--color-bg)" }}>
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

                {/* API Error Banner */}
                {apiError && (
                    <div className="mb-4 px-4 py-3 rounded-lg text-sm text-center"
                        style={{ backgroundColor: "rgba(248,113,113,0.1)", color: "var(--color-error)", border: "1px solid rgba(248,113,113,0.2)" }}>
                        {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                    {/* Email */}
                    <div>
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <input id="email" name="email" type="email"
                            className="input-field" placeholder="you@example.com"
                            value={form.email} onChange={handleChange} />
                        {errors.email && <p className="error-msg">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="form-label mb-0!" htmlFor="password">Password</label>
                            <Link to="/forgot-password"
                                className="text-xs hover:underline"
                                style={{ color: "var(--color-primary)" }}>
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <input id="password" name="password"
                                type={showPass ? "text" : "password"}
                                className="input-field pr-16" placeholder="Enter your password"
                                value={form.password} onChange={handleChange} />
                            <button type="button" onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium"
                                style={{ color: "var(--color-text-muted)" }}>
                                {showPass ? "Hide" : "Show"}
                            </button>
                        </div>
                        {errors.password && <p className="error-msg">{errors.password}</p>}
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={loading} className="btn-primary">
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