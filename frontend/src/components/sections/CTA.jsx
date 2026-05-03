import { Link } from "react-router-dom";

// ── Trust badges ──────────────────────────────────────────────────────────────
const BADGES = [
  { emoji: "🔒", text: "No credit card required" },
  { emoji: "⚡", text: "Instant access"           },
  { emoji: "♾️",  text: "Lifetime updates"         },
  { emoji: "🏆", text: "Certificate included"     },
];

// ── Floating stat cards ───────────────────────────────────────────────────────
const FloatCard = ({ emoji, value, label, className }) => (
  <div
    className={`absolute hidden lg:flex items-center gap-3 px-4 py-3
                rounded-xl shadow-xl pointer-events-none ${className}`}
    style={{
      backgroundColor: "var(--color-bg-card)",
      border:          "1px solid var(--color-border)",
      backdropFilter:  "blur(8px)",
    }}
  >
    <span className="text-2xl">{emoji}</span>
    <div>
      <p className="text-sm font-bold leading-none mb-0.5"
         style={{ color: "var(--color-text-heading)" }}>
        {value}
      </p>
      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
        {label}
      </p>
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const CTA = () => (
  <section
    className="py-16 sm:py-24"
    style={{ backgroundColor: "var(--color-bg)" }}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div
        className="relative overflow-hidden rounded-3xl px-6 sm:px-12 py-16 sm:py-20 text-center"
        style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 40%, #0ea5e9 100%)",
        }}
      >

        {/* ── Background decoration ───────────────────────────────────────── */}
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Glow orbs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10
                        rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-white/10
                        rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-96 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        {/* ── Floating cards ───────────────────────────────────────────────── */}
        <FloatCard
          emoji="🎓"
          value="50,000+"
          label="Active students"
          className="top-10 left-8"
        />
        <FloatCard
          emoji="⭐"
          value="4.9 / 5"
          label="Average rating"
          className="bottom-10 left-8"
        />
        <FloatCard
          emoji="🏅"
          value="20,000+"
          label="Certificates issued"
          className="top-10 right-8"
        />
        <FloatCard
          emoji="📈"
          value="92%"
          label="Career growth rate"
          className="bottom-10 right-8"
        />

        {/* ── Content ─────────────────────────────────────────────────────── */}
        <div className="relative z-10 max-w-2xl mx-auto">

          {/* Top pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                          bg-white/15 border border-white/25 text-white
                          text-xs font-semibold mb-6 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Limited Time — 50% Off All Courses
          </div>

          {/* Heading */}
          <h2
            className="text-3xl sm:text-5xl font-bold text-white mb-5 leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Start Your Learning
            <br />
            Journey{" "}
            <span className="relative inline-block">
              Today
              {/* Underline accent */}
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 120 8" fill="none"
              >
                <path
                  d="M2 5.5 C30 1.5, 70 7, 118 3"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-white/80 mb-8 leading-relaxed">
            Join 50,000+ learners already building their dream careers.
            <br className="hidden sm:block" />
            Get unlimited access to 500+ courses — cancel anytime.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2
                         px-8 py-3.5 rounded-xl font-bold text-sm
                         transition-all duration-200 hover:scale-105 active:scale-95
                         hover:shadow-xl"
              style={{ backgroundColor: "#ffffff", color: "#4f46e5" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f0ff"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ffffff"}
            >
              Get Started Free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              to="/courses"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2
                         px-8 py-3.5 rounded-xl font-semibold text-sm text-white
                         transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: "rgba(255,255,255,0.12)",
                border:          "1px solid rgba(255,255,255,0.3)",
                backdropFilter:  "blur(4px)",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)"}
            >
              Browse Courses
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {BADGES.map(({ emoji, text }) => (
              <div key={text}
                   className="flex items-center gap-1.5 text-xs text-white/70">
                <span>{emoji}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Below card: final reassurance strip ─────────────────────────── */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
        {[
          { emoji: "🎓", value: "500+", label: "Courses" },
          { emoji: "🧑‍🏫", value: "200+", label: "Instructors" },
          { emoji: "🌍", value: "80+",  label: "Countries" },
          { emoji: "💼", value: "85%",  label: "Got hired" },
        ].map(({ emoji, value, label }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-xl">{emoji}</span>
            <span className="font-bold text-sm"
                  style={{ color: "var(--color-text-heading)" }}>
              {value}
            </span>
            <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              {label}
            </span>
          </div>
        ))}
      </div>

    </div>
  </section>
);

export default CTA;