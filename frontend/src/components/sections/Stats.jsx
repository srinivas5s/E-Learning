// ── Data ──────────────────────────────────────────────────────────────────────
const STATS = [
  {
    value:   "50K+",
    label:   "Active Learners",
    emoji:   "🎓",
    color:   "#6366f1",
    bg:      "rgba(99,102,241,0.1)",
    border:  "rgba(99,102,241,0.2)",
    desc:    "students enrolled worldwide",
  },
  {
    value:   "500+",
    label:   "Expert Courses",
    emoji:   "📚",
    color:   "#0ea5e9",
    bg:      "rgba(14,165,233,0.1)",
    border:  "rgba(14,165,233,0.2)",
    desc:    "across 20+ categories",
  },
  {
    value:   "200+",
    label:   "Top Instructors",
    emoji:   "🧑‍🏫",
    color:   "#f59e0b",
    bg:      "rgba(245,158,11,0.1)",
    border:  "rgba(245,158,11,0.2)",
    desc:    "industry professionals",
  },
  {
    value:   "95%",
    label:   "Satisfaction Rate",
    emoji:   "⭐",
    color:   "#10b981",
    bg:      "rgba(16,185,129,0.1)",
    border:  "rgba(16,185,129,0.2)",
    desc:    "based on 12k+ reviews",
  },
];

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ value, label, emoji, color, bg, border, desc }) => (
  <div
    className="relative flex flex-col items-center text-center p-6 rounded-2xl
               transition-all duration-300 group cursor-default"
    style={{
      backgroundColor: "var(--color-bg-card)",
      border:          "1px solid var(--color-border)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor       = border;
      e.currentTarget.style.transform         = "translateY(-4px)";
      e.currentTarget.style.boxShadow         = `0 12px 32px ${bg}`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor       = "var(--color-border)";
      e.currentTarget.style.transform         = "translateY(0)";
      e.currentTarget.style.boxShadow         = "none";
    }}
  >
    {/* Icon bubble */}
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
      style={{ backgroundColor: bg, border: `1px solid ${border}` }}
    >
      {emoji}
    </div>

    {/* Value */}
    <span
      className="text-4xl font-bold tracking-tight mb-1"
      style={{ fontFamily: "var(--font-heading)", color }}
    >
      {value}
    </span>

    {/* Label */}
    <span
      className="text-sm font-semibold mb-1"
      style={{ color: "var(--color-text)" }}
    >
      {label}
    </span>

    {/* Description */}
    <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
      {desc}
    </span>

    {/* Bottom accent bar */}
    <div
      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0
                 rounded-full transition-all duration-300 group-hover:w-2/3"
      style={{ backgroundColor: color }}
    />
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const Stats = () => (
  <section
    className="py-16 sm:py-20"
    style={{ backgroundColor: "var(--color-bg)" }}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      {/* Section label */}
      <div className="text-center mb-10">
        <p
          className="text-sm font-semibold uppercase tracking-widest"
          style={{ color: "var(--color-primary)" }}
        >
          Platform at a Glance
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Divider */}
      <div
        className="mt-16 h-px w-full"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--color-border), transparent)",
        }}
      />
    </div>
  </section>
);

export default Stats;