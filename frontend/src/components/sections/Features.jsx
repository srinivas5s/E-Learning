// ── Data ──────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon:    "🕐",
    title:   "Learn Anytime, Anywhere",
    desc:    "Access your courses 24/7 from any device. Pick up right where you left off — on mobile, tablet, or desktop.",
    color:   "#6366f1",
    bg:      "rgba(99,102,241,0.1)",
    border:  "rgba(99,102,241,0.2)",
  },
  {
    icon:    "🧑‍🏫",
    title:   "Expert Instructors",
    desc:    "Learn from industry professionals with real-world experience. Every instructor is vetted and highly rated.",
    color:   "#0ea5e9",
    bg:      "rgba(14,165,233,0.1)",
    border:  "rgba(14,165,233,0.2)",
  },
  {
    icon:    "🏆",
    title:   "Earn Certificates",
    desc:    "Get recognized for your skills. Share verified certificates on LinkedIn and boost your career prospects.",
    color:   "#f59e0b",
    bg:      "rgba(245,158,11,0.1)",
    border:  "rgba(245,158,11,0.2)",
  },
  {
    icon:    "⚡",
    title:   "Hands-on Projects",
    desc:    "Apply what you learn with real projects and coding challenges. Build a portfolio employers actually want to see.",
    color:   "#10b981",
    bg:      "rgba(16,185,129,0.1)",
    border:  "rgba(16,185,129,0.2)",
  },
  {
    icon:    "🤝",
    title:   "Community Support",
    desc:    "Join a global community of learners. Ask questions, share progress, and grow together with peers.",
    color:   "#ec4899",
    bg:      "rgba(236,72,153,0.1)",
    border:  "rgba(236,72,153,0.2)",
  },
  {
    icon:    "📊",
    title:   "Track Your Progress",
    desc:    "Visual dashboards show exactly where you stand. Set goals, track streaks, and celebrate every milestone.",
    color:   "#8b5cf6",
    bg:      "rgba(139,92,246,0.1)",
    border:  "rgba(139,92,246,0.2)",
  },
];

// ── Feature Card ──────────────────────────────────────────────────────────────
const FeatureCard = ({ icon, title, desc, color, bg, border }) => (
  <div
    className="relative p-6 rounded-2xl transition-all duration-300 group cursor-default overflow-hidden"
    style={{
      backgroundColor: "var(--color-bg-card)",
      border:          "1px solid var(--color-border)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = border;
      e.currentTarget.style.transform   = "translateY(-4px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = "var(--color-border)";
      e.currentTarget.style.transform   = "translateY(0)";
    }}
  >
    {/* Hover glow in top-left corner */}
    <div
      className="absolute -top-10 -left-10 w-32 h-32 rounded-full blur-2xl
                 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                 pointer-events-none"
      style={{ backgroundColor: bg }}
    />

    {/* Icon */}
    <div
      className="relative w-12 h-12 rounded-xl flex items-center justify-center
                 text-2xl mb-5 transition-transform duration-300 group-hover:scale-110"
      style={{ backgroundColor: bg, border: `1px solid ${border}` }}
    >
      {icon}
    </div>

    {/* Title */}
    <h3
      className="text-base font-semibold mb-2 transition-colors duration-200"
      style={{ color: "var(--color-text-heading)" }}
    >
      {title}
    </h3>

    {/* Description */}
    <p
      className="text-sm leading-relaxed"
      style={{ color: "var(--color-text-muted)" }}
    >
      {desc}
    </p>

    {/* Bottom left accent dot */}
    <div
      className="absolute bottom-4 right-4 w-2 h-2 rounded-full opacity-0
                 group-hover:opacity-100 transition-opacity duration-300"
      style={{ backgroundColor: color }}
    />
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const Features = () => (
  <section
    className="py-16 sm:py-24"
    style={{ backgroundColor: "var(--color-bg)" }}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <p
          className="text-sm font-semibold uppercase tracking-widest mb-3"
          style={{ color: "var(--color-primary)" }}
        >
          Why LearnFlow
        </p>
        <h2
          className="text-3xl sm:text-4xl font-bold mb-4"
          style={{
            fontFamily: "var(--font-heading)",
            color:      "var(--color-text-heading)",
          }}
        >
          Everything You Need to{" "}
          <span style={{ color: "var(--color-primary)" }}>Succeed</span>
        </h2>
        <p
          className="text-base leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          We've built every feature with one goal — to help you learn faster,
          retain more, and land the career you deserve.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>

      {/* Bottom CTA strip */}
      <div
        className="mt-14 rounded-2xl px-6 sm:px-10 py-8
                   flex flex-col sm:flex-row items-center justify-between gap-6"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(14,165,233,0.08) 100%)",
          border:     "1px solid rgba(99,102,241,0.2)",
        }}
      >
        <div>
          <h3
            className="text-lg font-bold mb-1"
            style={{ color: "var(--color-text-heading)", fontFamily: "var(--font-heading)" }}
          >
            Ready to start your learning journey?
          </h3>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Join 50,000+ learners already growing their skills on LearnFlow.
          </p>
        </div>
        <a
          href="/register"
          className="btn-primary px-6 py-3 text-sm font-semibold rounded-xl whitespace-nowrap"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          Get Started Free →
        </a>
      </div>

    </div>
  </section>
);

export default Features;