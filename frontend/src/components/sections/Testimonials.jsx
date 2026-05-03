import { useState } from "react";

// ── Data ──────────────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    id:       1,
    name:     "Priya Sharma",
    role:     "Frontend Developer",
    company:  "Google",
    initials: "PS",
    bg:       "#6366f1",
    rating:   5,
    course:   "Full Stack Web Development",
    text:     "LearnFlow completely changed my career trajectory. The Full Stack course was incredibly well-structured — I went from knowing basic HTML to landing a job at Google in under 8 months. The project-based learning made all the difference.",
  },
  {
    id:       2,
    name:     "Rahul Verma",
    role:     "Data Analyst",
    company:  "Microsoft",
    initials: "RV",
    bg:       "#0ea5e9",
    rating:   5,
    course:   "Data Science with Python",
    text:     "I tried many platforms before LearnFlow. Nothing came close to the depth and quality here. The instructor explains every concept with real-world examples. I got promoted within 3 months of completing the Data Science course.",
  },
  {
    id:       3,
    name:     "Sara Johnson",
    role:     "Product Designer",
    company:  "Figma",
    initials: "SJ",
    bg:       "#ec4899",
    rating:   5,
    course:   "UI/UX Design Masterclass",
    text:     "The UI/UX Masterclass is simply the best design course available online. It's not just theory — you build 10 real projects. My portfolio went from empty to impressive, and I landed my dream job at Figma within 6 months.",
  },
  {
    id:       4,
    name:     "Arjun Mehta",
    role:     "Mobile Developer",
    company:  "Swiggy",
    initials: "AM",
    bg:       "#8b5cf6",
    rating:   5,
    course:   "React Native Mobile Dev",
    text:     "Went from zero mobile development experience to shipping two apps on the Play Store. The React Native course was concise, modern, and the instructor responds to questions within hours. Worth every rupee.",
  },
  {
    id:       5,
    name:     "Neha Kapoor",
    role:     "Backend Engineer",
    company:  "Razorpay",
    initials: "NK",
    bg:       "#10b981",
    rating:   5,
    course:   "Full Stack Web Development",
    text:     "The community support alone is worth it. Anytime I got stuck, someone from the community or the instructor helped me within the day. I now work at Razorpay and still come back to LearnFlow for new skills.",
  },
];

// ── Star Rating ───────────────────────────────────────────────────────────────
const Stars = ({ count = 5 }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02
                         12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
  </div>
);

// ── Quote Icon ────────────────────────────────────────────────────────────────
const QuoteIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24"
       fill="var(--color-primary)" opacity="0.15">
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25
             0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1
             1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25
             0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25
             4-2.75 4v3c0 1 0 1 1 1z" />
  </svg>
);

// ── Testimonial Card ──────────────────────────────────────────────────────────
const TestimonialCard = ({ name, role, company, initials, bg, rating, course, text, active }) => (
  <div
    className="flex flex-col h-full p-6 rounded-2xl transition-all duration-300"
    style={{
      backgroundColor: "var(--color-bg-card)",
      border:          `1px solid ${active ? "rgba(99,102,241,0.4)" : "var(--color-border)"}`,
      boxShadow:       active ? "0 8px 32px rgba(99,102,241,0.12)" : "none",
      transform:       active ? "scale(1.02)" : "scale(1)",
    }}
  >
    {/* Quote + Stars */}
    <div className="flex items-start justify-between mb-4">
      <QuoteIcon />
      <Stars count={rating} />
    </div>

    {/* Text */}
    <p
      className="text-sm leading-relaxed flex-1 mb-5"
      style={{ color: "var(--color-text-muted)" }}
    >
      "{text}"
    </p>

    {/* Course tag */}
    <div
      className="inline-flex items-center gap-1.5 text-xs font-medium
                 px-2.5 py-1 rounded-full self-start mb-5"
      style={{
        backgroundColor: "rgba(99,102,241,0.08)",
        color:           "var(--color-primary)",
        border:          "1px solid rgba(99,102,241,0.15)",
      }}
    >
      <span>📚</span>
      {course}
    </div>

    {/* Author */}
    <div
      className="flex items-center gap-3 pt-4"
      style={{ borderTop: "1px solid var(--color-border)" }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center
                   text-sm font-bold text-white shrink-0"
        style={{ backgroundColor: bg }}
      >
        {initials}
      </div>
      <div>
        <p className="text-sm font-semibold" style={{ color: "var(--color-text-heading)" }}>
          {name}
        </p>
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          {role} · {company}
        </p>
      </div>
      {/* Verified badge */}
      <div className="ml-auto">
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1"
          style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10b981" }}
        >
          ✓ Verified
        </span>
      </div>
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const Testimonials = () => {
  const [active, setActive] = useState(0);

  // Show 3 at a time on desktop, 1 on mobile
  const visible = [
    TESTIMONIALS[active % TESTIMONIALS.length],
    TESTIMONIALS[(active + 1) % TESTIMONIALS.length],
    TESTIMONIALS[(active + 2) % TESTIMONIALS.length],
  ];

  const prev = () => setActive((a) => (a - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setActive((a) => (a + 1) % TESTIMONIALS.length);

  return (
    <section
      className="py-16 sm:py-24 relative overflow-hidden"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Subtle background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   w-[600px] h-[400px] rounded-full blur-3xl opacity-5 pointer-events-none"
        style={{ backgroundColor: "var(--color-primary)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--color-primary)" }}
          >
            Student Stories
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-heading)" }}
          >
            Loved by{" "}
            <span style={{ color: "var(--color-primary)" }}>Thousands</span>
            {" "}of Learners
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            Don't take our word for it — hear from students who transformed
            their careers with LearnFlow.
          </p>
        </div>

        {/* Overall rating strip */}
        <div
          className="flex flex-wrap items-center justify-center gap-6 mb-12
                     py-4 px-6 rounded-2xl max-w-xl mx-auto"
          style={{
            backgroundColor: "var(--color-bg-card)",
            border:          "1px solid var(--color-border)",
          }}
        >
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: "var(--color-text-heading)", fontFamily: "var(--font-heading)" }}>
              4.9
            </p>
            <Stars count={5} />
            <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>Overall Rating</p>
          </div>
          <div
            className="w-px h-12 hidden sm:block"
            style={{ backgroundColor: "var(--color-border)" }}
          />
          <div className="flex gap-4 text-center">
            {[["98%", "Completion"], ["50K+", "Students"], ["12K+", "Reviews"]].map(([val, lbl]) => (
              <div key={lbl}>
                <p className="text-lg font-bold" style={{ color: "var(--color-text-heading)" }}>{val}</p>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{lbl}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cards — desktop: 3 visible, mobile: 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {visible.map((t, i) => (
            <TestimonialCard key={t.id} {...t} active={i === 0} />
          ))}
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-center gap-4">
          {/* Prev */}
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full flex items-center justify-center
                       transition-all duration-150 hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "var(--color-bg-card)",
              border:          "1px solid var(--color-border)",
              color:           "var(--color-text-muted)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor       = "var(--color-primary)";
              e.currentTarget.style.color             = "var(--color-primary)";
              e.currentTarget.style.backgroundColor   = "rgba(99,102,241,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor       = "var(--color-border)";
              e.currentTarget.style.color             = "var(--color-text-muted)";
              e.currentTarget.style.backgroundColor   = "var(--color-bg-card)";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="rounded-full transition-all duration-200"
                style={{
                  width:           i === active ? "24px" : "8px",
                  height:          "8px",
                  backgroundColor: i === active ? "var(--color-primary)" : "var(--color-border)",
                }}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={next}
            className="w-10 h-10 rounded-full flex items-center justify-center
                       transition-all duration-150 hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "var(--color-bg-card)",
              border:          "1px solid var(--color-border)",
              color:           "var(--color-text-muted)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor       = "var(--color-primary)";
              e.currentTarget.style.color             = "var(--color-primary)";
              e.currentTarget.style.backgroundColor   = "rgba(99,102,241,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor       = "var(--color-border)";
              e.currentTarget.style.color             = "var(--color-text-muted)";
              e.currentTarget.style.backgroundColor   = "var(--color-bg-card)";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;