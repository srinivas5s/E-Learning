import { Link } from "react-router-dom";

// ── Data ──────────────────────────────────────────────────────────────────────
const COURSES = [
  {
    id:         1,
    title:      "Full Stack Web Development",
    instructor: "Jane Doe",
    instructorInitials: "JD",
    instructorBg: "#6366f1",
    category:   "Web Development",
    categoryColor: "#6366f1",
    categoryBg:  "rgba(99,102,241,0.1)",
    rating:     4.9,
    reviews:    2340,
    students:   12400,
    price:      4999,
    originalPrice: 9999,
    duration:   "42 hrs",
    lessons:    128,
    level:      "Beginner",
    emoji:      "💻",
    badge:      "Bestseller",
    badgeColor: "#f59e0b",
    badgeBg:    "rgba(245,158,11,0.12)",
  },
  {
    id:         2,
    title:      "UI/UX Design Masterclass",
    instructor: "Alex Kim",
    instructorInitials: "AK",
    instructorBg: "#ec4899",
    category:   "Design",
    categoryColor: "#ec4899",
    categoryBg:  "rgba(236,72,153,0.1)",
    rating:     4.8,
    reviews:    1890,
    students:   9800,
    price:      3999,
    originalPrice: 7999,
    duration:   "36 hrs",
    lessons:    94,
    level:      "Intermediate",
    emoji:      "🎨",
    badge:      "Top Rated",
    badgeColor: "#10b981",
    badgeBg:    "rgba(16,185,129,0.12)",
  },
  {
    id:         3,
    title:      "Data Science with Python",
    instructor: "Sam Patel",
    instructorInitials: "SP",
    instructorBg: "#0ea5e9",
    category:   "Data Science",
    categoryColor: "#0ea5e9",
    categoryBg:  "rgba(14,165,233,0.1)",
    rating:     4.7,
    reviews:    3120,
    students:   15600,
    price:      5499,
    originalPrice: 10999,
    duration:   "58 hrs",
    lessons:    162,
    level:      "Intermediate",
    emoji:      "📊",
    badge:      "Hot",
    badgeColor: "#ef4444",
    badgeBg:    "rgba(239,68,68,0.12)",
  },
  {
    id:         4,
    title:      "React Native Mobile Dev",
    instructor: "Chris Lee",
    instructorInitials: "CL",
    instructorBg: "#8b5cf6",
    category:   "Mobile Dev",
    categoryColor: "#8b5cf6",
    categoryBg:  "rgba(139,92,246,0.1)",
    rating:     4.8,
    reviews:    1450,
    students:   7200,
    price:      4499,
    originalPrice: 8999,
    duration:   "48 hrs",
    lessons:    110,
    level:      "Advanced",
    emoji:      "📱",
    badge:      "New",
    badgeColor: "#6366f1",
    badgeBg:    "rgba(99,102,241,0.12)",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const StarRating = ({ rating }) => {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full;
        const isHalf = !filled && i === full && half;
        return (
          <svg key={i} width="13" height="13" viewBox="0 0 24 24"
               fill={filled || isHalf ? "#f59e0b" : "none"}
               stroke="#f59e0b" strokeWidth="1.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02
                             12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
      })}
    </div>
  );
};

const formatPrice = (p) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(p);

// ── Course Card ───────────────────────────────────────────────────────────────
const CourseCard = ({
  title, instructor, instructorInitials, instructorBg,
  category, categoryColor, categoryBg,
  rating, reviews, students, price, originalPrice,
  duration, lessons, level, emoji, badge, badgeColor, badgeBg,
}) => (
  <div
    className="flex flex-col rounded-2xl overflow-hidden transition-all duration-300
               group cursor-pointer"
    style={{
      backgroundColor: "var(--color-bg-card)",
      border:          "1px solid var(--color-border)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform  = "translateY(-6px)";
      e.currentTarget.style.boxShadow  = "0 20px 48px rgba(0,0,0,0.15)";
      e.currentTarget.style.borderColor = categoryColor;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform  = "translateY(0)";
      e.currentTarget.style.boxShadow  = "none";
      e.currentTarget.style.borderColor = "var(--color-border)";
    }}
  >
    {/* ── Thumbnail ───────────────────────────────────────────────────────── */}
    <div
      className="relative h-44 flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: categoryBg }}
    >
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `linear-gradient(135deg, ${categoryColor}40 0%, transparent 70%)`,
        }}
      />

      {/* Emoji */}
      <span className="text-6xl relative z-10 transition-transform duration-300
                       group-hover:scale-110">
        {emoji}
      </span>

      {/* Badge */}
      <span
        className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
        style={{ backgroundColor: badgeBg, color: badgeColor, border: `1px solid ${badgeColor}30` }}
      >
        {badge}
      </span>

      {/* Level pill */}
      <span
        className="absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full"
        style={{
          backgroundColor: "rgba(0,0,0,0.4)",
          color:           "#fff",
          backdropFilter:  "blur(4px)",
        }}
      >
        {level}
      </span>
    </div>

    {/* ── Body ────────────────────────────────────────────────────────────── */}
    <div className="flex flex-col flex-1 p-5">

      {/* Category */}
      <span
        className="text-xs font-semibold mb-2 self-start px-2 py-0.5 rounded-full"
        style={{ backgroundColor: categoryBg, color: categoryColor }}
      >
        {category}
      </span>

      {/* Title */}
      <h3
        className="text-sm font-semibold leading-snug mb-3 line-clamp-2
                   transition-colors duration-200 group-hover:text-[var(--color-primary)]"
        style={{ color: "var(--color-text-heading)" }}
      >
        {title}
      </h3>

      {/* Instructor */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center
                     text-xs font-bold text-white shrink-0"
          style={{ backgroundColor: instructorBg }}
        >
          {instructorInitials}
        </div>
        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          {instructor}
        </span>
      </div>

      {/* Rating row */}
      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-xs font-bold" style={{ color: "#f59e0b" }}>
          {rating}
        </span>
        <StarRating rating={rating} />
        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          ({reviews.toLocaleString()})
        </span>
      </div>

      {/* Meta row */}
      <div
        className="flex items-center gap-3 text-xs pb-4 mb-4"
        style={{
          color:        "var(--color-text-muted)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <span className="flex items-center gap-1">
          <span>🕐</span> {duration}
        </span>
        <span className="flex items-center gap-1">
          <span>📖</span> {lessons} lessons
        </span>
        <span className="flex items-center gap-1">
          <span>👥</span> {students.toLocaleString()}
        </span>
      </div>

      {/* Price row */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-baseline gap-2">
          <span
            className="text-lg font-bold"
            style={{ color: "var(--color-text-heading)", fontFamily: "var(--font-heading)" }}
          >
            {formatPrice(price)}
          </span>
          <span
            className="text-xs line-through"
            style={{ color: "var(--color-text-muted)" }}
          >
            {formatPrice(originalPrice)}
          </span>
        </div>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded"
          style={{ backgroundColor: "rgba(16,185,129,0.12)", color: "#10b981" }}
        >
          {Math.round((1 - price / originalPrice) * 100)}% off
        </span>
      </div>
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const CoursesPreview = () => (
  <section
    className="py-16 sm:py-24"
    style={{ backgroundColor: "var(--color-bg)" }}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
        <div>
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--color-primary)" }}
          >
            Featured Courses
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{
              fontFamily: "var(--font-heading)",
              color:      "var(--color-text-heading)",
            }}
          >
            Start with Our{" "}
            <span style={{ color: "var(--color-primary)" }}>Top Picks</span>
          </h2>
        </div>
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-sm font-semibold
                     transition-colors duration-150 whitespace-nowrap shrink-0"
          style={{ color: "var(--color-primary)" }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = "0.75"}
          onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
        >
          View all courses
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {COURSES.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-10">
        <Link
          to="/courses"
          className="btn-primary inline-flex px-8 py-3 text-sm font-semibold rounded-xl"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          Explore All 500+ Courses →
        </Link>
      </div>

    </div>
  </section>
);

export default CoursesPreview;