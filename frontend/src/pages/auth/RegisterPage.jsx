import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../../api/auth.api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const RegisterPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [redirecting, setRedirecting] = useState(false);


    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Name is required";
        if (!form.email.trim()) e.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
        if (!form.password) e.password = "Password is required";
        else if (form.password.length < 8) e.password = "Minimum 8 characters";
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
            const res = await authApi.register(form);
            const { user, accessToken } = res.data.data;
            setRedirecting(true);
            login(user, accessToken);
            setTimeout(() => navigate("/", { replace: true }), 1400);
        } catch (err) {
            setApiError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

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
                        Registration Successful!
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

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10"
            style={{ backgroundColor: "var(--color-bg)" }}>

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
                        <span className="text-2xl">🎓</span>
                    </div>
                    <h1 className="text-2xl font-bold"
                        style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}>
                        Create Account
                    </h1>
                    <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                        Join and start learning today
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

                    {/* Role Toggle */}
                    <div>
                        <label className="form-label">I want to</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[{ value: "student", label: "📖 Learn" }, { value: "instructor", label: "🧑‍🏫 Teach" }].map((r) => (
                                <button key={r.value} type="button"
                                    onClick={() => setForm({ ...form, role: r.value })}
                                    className="py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-150"
                                    style={{
                                        backgroundColor: form.role === r.value ? "var(--color-primary)" : "var(--color-bg-input)",
                                        color: form.role === r.value ? "#fff" : "var(--color-text-muted)",
                                        border: `1px solid ${form.role === r.value ? "var(--color-primary)" : "var(--color-border)"}`,
                                    }}>
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="form-label" htmlFor="name">Full Name</label>
                        <input id="name" name="name" type="text"
                            className="input-field" placeholder="John Doe"
                            value={form.name} onChange={handleChange} />
                        {errors.name && <p className="error-msg">{errors.name}</p>}
                    </div>

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
                        <label className="form-label" htmlFor="password">Password</label>
                        <div className="relative">
                            <input id="password" name="password"
                                type={showPass ? "text" : "password"}
                                className="input-field pr-16" placeholder="Min 8 characters"
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
                            : "Create Account"}
                    </button>
                </form>

                <p className="text-center text-sm mt-6" style={{ color: "var(--color-text-muted)" }}>
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold hover:underline"
                        style={{ color: "var(--color-primary)" }}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;