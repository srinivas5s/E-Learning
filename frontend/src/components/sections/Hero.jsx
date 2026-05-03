import { Link } from "react-router-dom";

// ── Trusted by avatars (dummy) ────────────────────────────────────────────────
const AVATARS = [
    { initials: "AK", bg: "#6366f1" },
    { initials: "SM", bg: "#0ea5e9" },
    { initials: "RJ", bg: "#f59e0b" },
    { initials: "PL", bg: "#10b981" },
];

// ── Floating badge ────────────────────────────────────────────────────────────
const FloatingBadge = ({ emoji, text, className }) => (
    <div
        className={`absolute hidden lg:flex items-center gap-2 px-3 py-2
                rounded-xl shadow-lg backdrop-blur-sm text-sm font-medium
                whitespace-nowrap ${className}`}
        style={{
            backgroundColor: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
        }}
    >
        <span>{emoji}</span>
        <span>{text}</span>
    </div>
);

// ── Star rating ───────────────────────────────────────────────────────────────
const Stars = ({ count = 5 }) => (
    <div className="flex gap-0.5">
        {Array.from({ length: count }).map((_, i) => (
            <svg key={i} width="14" height="14" viewBox="0 0 24 24"
                fill="#f59e0b" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14
                         18.18 21.02 12 17.77 5.82 21.02
                         7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        ))}
    </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const Hero = () => {
    return (
        <section
            className="relative overflow-hidden"
            style={{ backgroundColor: "var(--color-bg)" }}
        >
            {/* ── Background glow blobs ─────────────────────────────────────────── */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
                    style={{ backgroundColor: "var(--color-primary)" }}
                />
                <div
                    className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
                    style={{ backgroundColor: "#0ea5e9" }}
                />
            </div>

            {/* ── Grid dot pattern overlay ──────────────────────────────────────── */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, var(--color-text) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            />

            {/* ── Content ───────────────────────────────────────────────────────── */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
                <div className="grid lg:grid-cols-2 gap-14 items-center">

                    {/* ── Left: Text ──────────────────────────────────────────────── */}
                    <div className="flex flex-col items-start">

                        {/* Badge */}
                        <div
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                         text-xs font-semibold mb-6"
                            style={{
                                backgroundColor: "rgba(99,102,241,0.12)",
                                color: "var(--color-primary)",
                                border: "1px solid rgba(99,102,241,0.25)",
                            }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                                style={{ backgroundColor: "var(--color-primary)" }} />
                            #1 Online Learning Platform
                        </div>

                        {/* Heading */}
                        <h1
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6"
                            style={{
                                fontFamily: "var(--font-heading)",
                                color: "var(--color-text-heading)",
                            }}
                        >
                            Learn Without{" "}
                            <span
                                className="relative inline-block"
                                style={{ color: "var(--color-primary)" }}
                            >
                                Limits
                                {/* Underline accent */}
                                <svg
                                    className="absolute -bottom-2 left-0 w-full"
                                    viewBox="0 0 200 8" fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M1 5.5 C50 1, 100 7, 199 3"
                                        stroke="var(--color-primary)"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        opacity="0.5"
                                    />
                                </svg>
                            </span>
                            {" "}with Expert Instructors
                        </h1>

                        {/* Subheading */}
                        <p
                            className="text-base sm:text-lg leading-relaxed mb-8 max-w-lg"
                            style={{ color: "var(--color-text-muted)" }}
                        >
                            Access 500+ expert-led courses in tech, design, and business.
                            Learn at your own pace, earn certificates, and advance your career.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-3 mb-10">
                            <Link
                                to="/register"
                                className="btn-primary px-6 py-3 text-sm font-semibold rounded-xl"
                                style={{ backgroundColor: "var(--color-primary)" }}
                            >
                                Start Learning Free
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>

                            <Link
                                to="/courses"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                           text-sm font-semibold transition-all duration-200"
                                style={{
                                    color: "var(--color-text)",
                                    backgroundColor: "var(--color-bg-card)",
                                    border: "1px solid var(--color-border)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "var(--color-primary)";
                                    e.currentTarget.style.color = "var(--color-primary)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "var(--color-border)";
                                    e.currentTarget.style.color = "var(--color-text)";
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
                                </svg>
                                Browse Courses
                            </Link>
                        </div>

                        {/* Social proof */}
                        <div className="flex items-center gap-4">
                            {/* Avatars */}
                            <div className="flex -space-x-2.5">
                                {AVATARS.map((a) => (
                                    <div
                                        key={a.initials}
                                        className="w-9 h-9 rounded-full flex items-center justify-center
                               text-xs font-bold text-white ring-2"
                                        style={{
                                            backgroundColor: a.bg,
                                            ringColor: "var(--color-bg)",
                                        }}
                                    >
                                        {a.initials}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5 mb-0.5">
                                    <Stars count={5} />
                                    <span className="text-sm font-semibold"
                                        style={{ color: "var(--color-text)" }}>
                                        4.9/5
                                    </span>
                                </div>
                                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                                    from 12,000+ learners
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Visual card ──────────────────────────────────────── */}
                    <div className="relative flex items-center justify-center">

                        {/* Floating badges */}
                        <FloatingBadge
                            emoji="🏆"
                            text="Certificate Included"
                            className="top-6 -left-4"
                        />
                        <FloatingBadge
                            emoji="⚡"
                            text="Instant Access"
                            className="bottom-16 -left-6"
                        />
                        <FloatingBadge
                            emoji="🌍"
                            text="50k+ Students"
                            className="top-10 -right-4"
                        />

                        {/* Main card */}
                        <div
                            className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
                            style={{
                                backgroundColor: "var(--color-bg-card)",
                                border: "1px solid var(--color-border)",
                            }}
                        >
                            {/* Card header — fake course thumbnail */}
                            <div
                                className="h-44 flex items-center justify-center relative overflow-hidden"
                                style={{ backgroundColor: "rgba(99,102,241,0.1)" }}
                            >
                                <div className="absolute inset-0 opacity-20"
                                    style={{
                                        backgroundImage: "linear-gradient(135deg, var(--color-primary) 0%, #0ea5e9 100%)",
                                    }} />
                                <span className="text-6xl relative z-10">💻</span>

                                {/* Play button */}
                                <div
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <div
                                        className="w-14 h-14 rounded-full flex items-center justify-center
                               shadow-lg cursor-pointer hover:scale-110 transition-transform duration-200"
                                        style={{ backgroundColor: "var(--color-primary)" }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24"
                                            fill="white" stroke="none">
                                            <polygon points="5 3 19 12 5 21 5 3" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Card body */}
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <span
                                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                        style={{
                                            backgroundColor: "rgba(99,102,241,0.12)",
                                            color: "var(--color-primary)",
                                        }}
                                    >
                                        Web Development
                                    </span>
                                    <span className="text-xs font-bold"
                                        style={{ color: "var(--color-success)" }}>
                                        Bestseller
                                    </span>
                                </div>

                                <h3
                                    className="font-semibold text-base mb-1"
                                    style={{ color: "var(--color-text-heading)" }}
                                >
                                    Full Stack Web Development
                                </h3>
                                <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                                    React, Node.js, MongoDB & more
                                </p>

                                {/* Progress bar */}
                                <div className="mb-3">
                                    <div className="flex justify-between text-xs mb-1.5"
                                        style={{ color: "var(--color-text-muted)" }}>
                                        <span>Progress</span>
                                        <span style={{ color: "var(--color-primary)" }}>68%</span>
                                    </div>
                                    <div
                                        className="h-1.5 rounded-full overflow-hidden"
                                        style={{ backgroundColor: "var(--color-border)" }}
                                    >
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                width: "68%",
                                                backgroundColor: "var(--color-primary)",
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Instructor row */}
                                <div className="flex items-center justify-between pt-3"
                                    style={{ borderTop: "1px solid var(--color-border)" }}>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-7 h-7 rounded-full flex items-center justify-center
                                 text-xs font-bold text-white"
                                            style={{ backgroundColor: "#0ea5e9" }}
                                        >
                                            JD
                                        </div>
                                        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                                            Jane Doe
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Stars count={5} />
                                        <span className="text-xs font-semibold"
                                            style={{ color: "var(--color-text)" }}>
                                            4.9
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Bottom fade ───────────────────────────────────────────────────── */}
            <div
                className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(to bottom, transparent, var(--color-bg))",
                }}
            />
        </section>
    );
};

export default Hero;