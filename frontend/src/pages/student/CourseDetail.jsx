import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useGetCourseBySlug } from "../../services/useCourse.js";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  formatPrice,
  formatDuration,
  LEVEL_BADGE,
} from "../../constants/courseConstants.js";

// ── Icons ─────────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
       stroke="#10b981" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24"
       fill={filled ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02
                     12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="none">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const ClockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const UsersIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const BarChartIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4"  />
    <line x1="6"  y1="20" x2="6"  y2="14" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10
             15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

// ── Helpers ───────────────────────────────────────────────────────────────────
const Stars = ({ rating }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <StarIcon key={i} filled={i < Math.round(rating)} />
    ))}
  </div>
);

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

// ── Skeleton ──────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="min-h-screen animate-pulse" style={{ backgroundColor: "var(--color-bg)" }}>
    <div className="h-72 w-full" style={{ backgroundColor: "var(--color-bg-card)" }} />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <div className="h-8 rounded w-3/4" style={{ backgroundColor: "var(--color-border)" }} />
        <div className="h-4 rounded w-1/2" style={{ backgroundColor: "var(--color-border)" }} />
        <div className="h-4 rounded w-full" style={{ backgroundColor: "var(--color-border)" }} />
        <div className="h-4 rounded w-5/6" style={{ backgroundColor: "var(--color-border)" }} />
      </div>
      <div className="h-64 rounded-2xl" style={{ backgroundColor: "var(--color-bg-card)" }} />
    </div>
  </div>
);

// ── Not Found ─────────────────────────────────────────────────────────────────
const CourseNotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4"
       style={{ backgroundColor: "var(--color-bg)" }}>
    <span className="text-6xl">🔍</span>
    <h1 className="text-2xl font-bold"
        style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-heading)" }}>
      Course Not Found
    </h1>
    <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
      This course doesn't exist or has been unpublished.
    </p>
    <Link to="/courses" className="btn-primary px-6 py-2.5 text-sm mt-2"
          style={{ backgroundColor: "var(--color-primary)" }}>
      Browse Courses
    </Link>
  </div>
);

// ── Enroll / Price card ───────────────────────────────────────────────────────
const EnrollCard = ({ course, isAuthenticated, isStudent }) => {
  const navigate = useNavigate();
  const hasDiscount = course.discountPrice > 0 && course.discountPrice < course.price;
  const effectivePrice = hasDiscount ? course.discountPrice : course.price;
  const discountPct = hasDiscount
    ? Math.round((1 - course.discountPrice / course.price) * 100)
    : 0;

  const handleEnroll = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/courses/${course.slug}` } } });
      return;
    }
    // Enrollment logic — Phase 3
    alert("Enrollment system coming in Phase 3!");
  };

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-xl sticky top-20"
      style={{
        backgroundColor: "var(--color-bg-card)",
        border:          "1px solid var(--color-border)",
      }}
    >
      {/* Thumbnail preview */}
      <div
        className="relative h-48 flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: "rgba(99,102,241,0.08)" }}
      >
        {course.thumbnail?.url ? (
          <img src={course.thumbnail.url} alt={course.title}
               className="w-full h-full object-cover" />
        ) : (
          <span className="text-6xl">📚</span>
        )}
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center
                        bg-black/20 cursor-pointer group/play">
          <div className="w-14 h-14 rounded-full flex items-center justify-center
                          transition-transform duration-200 group-hover/play:scale-110"
               style={{ backgroundColor: "var(--color-primary)" }}>
            <PlayIcon />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Price */}
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-3xl font-bold"
                style={{ color: "var(--color-text-heading)", fontFamily: "var(--font-heading)" }}>
            {formatPrice(effectivePrice)}
          </span>
          {hasDiscount && (
            <span className="text-base line-through"
                  style={{ color: "var(--color-text-muted)" }}>
              {formatPrice(course.price)}
            </span>
          )}
        </div>
        {hasDiscount && (
          <p className="text-sm font-semibold mb-4" style={{ color: "#10b981" }}>
            {discountPct}% off — Limited time deal!
          </p>
        )}

        {/* Enroll button */}
        <button
          onClick={handleEnroll}
          className="btn-primary w-full py-3 text-sm font-bold rounded-xl mb-3"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          {!isAuthenticated
            ? "Sign In to Enroll"
            : effectivePrice === 0
            ? "Enroll for Free"
            : "Enroll Now"}
        </button>

        {/* Guarantee */}
        <p className="text-xs text-center mb-5" style={{ color: "var(--color-text-muted)" }}>
          30-Day Money-Back Guarantee
        </p>

        {/* Course includes */}
        <div style={{ borderTop: "1px solid var(--color-border)" }} className="pt-4">
          <p className="text-xs font-semibold uppercase tracking-wider mb-3"
             style={{ color: "var(--color-text-muted)" }}>
            This course includes
          </p>
          <ul className="space-y-2.5">
            {[
              { icon: <ClockIcon />,     text: course.duration ? `${formatDuration(course.duration)} of content` : "Self-paced learning" },
              { icon: <BarChartIcon />,  text: `${course.level?.charAt(0).toUpperCase() + course.level?.slice(1)} level` },
              { icon: <GlobeIcon />,     text: `Taught in ${course.language || "English"}` },
              { icon: <UsersIcon />,     text: `${course.studentsEnrolled?.toLocaleString() || 0} students enrolled` },
              { icon: <CheckIcon />,     text: "Certificate of completion" },
            ].map(({ icon, text }) => (
              <li key={text} className="flex items-center gap-2.5 text-xs"
                  style={{ color: "var(--color-text-muted)" }}>
                <span style={{ color: "var(--color-primary)" }}>{icon}</span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Share */}
        <div className="flex gap-2 mt-5 pt-4"
             style={{ borderTop: "1px solid var(--color-border)" }}>
          <button
            className="flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-150"
            style={{
              backgroundColor: "var(--color-bg-input)",
              color:           "var(--color-text-muted)",
              border:          "1px solid var(--color-border)",
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--color-primary)"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--color-border)"}
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
          >
            🔗 Copy Link
          </button>
          <button
            className="flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-150"
            style={{
              backgroundColor: "var(--color-bg-input)",
              color:           "var(--color-text-muted)",
              border:          "1px solid var(--color-border)",
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--color-primary)"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--color-border)"}
          >
            🎁 Gift Course
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const CourseDetail = () => {
  const { slug }                    = useParams();
  const { isAuthenticated, isStudent } = useAuth();
  const { course, loading, fetch }  = useGetCourseBySlug();

  useEffect(() => { fetch(slug); }, [slug]);

  if (loading) return <Skeleton />;
  if (!course)  return <CourseNotFound />;

  const level       = LEVEL_BADGE[course.level] || LEVEL_BADGE.beginner;
  const hasDiscount = course.discountPrice > 0 && course.discountPrice < course.price;

  return (
    <div style={{ backgroundColor: "var(--color-bg)" }}>

      {/* ── Hero banner ──────────────────────────────────────────────── */}
      <div
        className="relative py-12 sm:py-16 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #1e293b 60%, #0f172a 100%)",
        }}
      >
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
             style={{
               backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
               backgroundSize:  "28px 28px",
             }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="lg:max-w-2xl">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs mb-5 flex-wrap"
                 style={{ color: "rgba(255,255,255,0.5)" }}>
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link to="/courses" className="hover:text-white transition-colors">Courses</Link>
              <span>/</span>
              <span style={{ color: "rgba(255,255,255,0.8)" }}
                    className="truncate max-w-xs">{course.title}</span>
            </nav>

            {/* Category + Level */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ backgroundColor: "rgba(99,102,241,0.3)", color: "#a5b4fc" }}>
                {course.category}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full capitalize"
                    style={{ backgroundColor: `${level.color}25`, color: level.color }}>
                {course.level}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-4 leading-tight"
                style={{ fontFamily: "var(--font-heading)" }}>
              {course.title}
            </h1>

            {/* Subtitle */}
            {course.subtitle && (
              <p className="text-base mb-5" style={{ color: "rgba(255,255,255,0.7)" }}>
                {course.subtitle}
              </p>
            )}

            {/* Rating + meta row */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {course.averageRating > 0 && (
                <div className="flex items-center gap-2">
                  <span className="font-bold" style={{ color: "#f59e0b" }}>
                    {course.averageRating}
                  </span>
                  <Stars rating={course.averageRating} />
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>
                    ({course.totalRatings?.toLocaleString()} ratings)
                  </span>
                </div>
              )}
              <span style={{ color: "rgba(255,255,255,0.6)" }}>
                👥 {course.studentsEnrolled?.toLocaleString() || 0} students
              </span>
              {course.duration > 0 && (
                <span style={{ color: "rgba(255,255,255,0.6)" }}>
                  🕐 {formatDuration(course.duration)}
                </span>
              )}
              <span style={{ color: "rgba(255,255,255,0.6)" }}>
                🌍 {course.language || "English"}
              </span>
            </div>

            {/* Instructor */}
            {course.instructor && (
              <div className="flex items-center gap-2.5 mt-5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center
                                text-sm font-bold text-white shrink-0"
                     style={{ backgroundColor: "#6366f1" }}>
                  {course.instructor.avatar?.url
                    ? <img src={course.instructor.avatar.url}
                           className="w-full h-full rounded-full object-cover"
                           alt={course.instructor.name} />
                    : getInitials(course.instructor.name)}
                </div>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Created by{" "}
                  <span className="font-semibold text-white">
                    {course.instructor.name}
                  </span>
                </span>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── Body: 2-col layout ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ── Left: main content ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">

            {/* What you'll learn */}
            {course.learningOutcomes?.length > 0 && (
              <div
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: "var(--color-bg-card)",
                  border:          "1px solid var(--color-border)",
                }}
              >
                <h2 className="text-lg font-bold mb-5"
                    style={{ color: "var(--color-text-heading)", fontFamily: "var(--font-heading)" }}>
                  What You'll Learn
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.learningOutcomes.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="mt-0.5 shrink-0"><CheckIcon /></span>
                      <span className="text-sm" style={{ color: "var(--color-text)" }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h2 className="text-lg font-bold mb-4"
                  style={{ color: "var(--color-text-heading)", fontFamily: "var(--font-heading)" }}>
                About This Course
              </h2>
              <div className="text-sm leading-relaxed whitespace-pre-line"
                   style={{ color: "var(--color-text-muted)" }}>
                {course.description}
              </div>
            </div>

            {/* Requirements */}
            {course.requirements?.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-4"
                    style={{ color: "var(--color-text-heading)", fontFamily: "var(--font-heading)" }}>
                  Requirements
                </h2>
                <ul className="space-y-2">
                  {course.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm"
                        style={{ color: "var(--color-text-muted)" }}>
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: "var(--color-primary)" }} />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Instructor section */}
            {course.instructor && (
              <div
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: "var(--color-bg-card)",
                  border:          "1px solid var(--color-border)",
                }}
              >
                <h2 className="text-lg font-bold mb-5"
                    style={{ color: "var(--color-text-heading)", fontFamily: "var(--font-heading)" }}>
                  Your Instructor
                </h2>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center
                                  text-xl font-bold text-white shrink-0"
                       style={{ backgroundColor: "#6366f1" }}>
                    {course.instructor.avatar?.url
                      ? <img src={course.instructor.avatar.url}
                             className="w-full h-full rounded-2xl object-cover"
                             alt={course.instructor.name} />
                      : getInitials(course.instructor.name)}
                  </div>
                  <div>
                    <h3 className="font-bold mb-1"
                        style={{ color: "var(--color-text-heading)" }}>
                      {course.instructor.name}
                    </h3>
                    {course.instructor.bio && (
                      <p className="text-sm leading-relaxed"
                         style={{ color: "var(--color-text-muted)" }}>
                        {course.instructor.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* ── Right: sticky enroll card ─────────────────────────── */}
          <div>
            {/* Mobile price strip */}
            <div
              className="lg:hidden flex items-center justify-between px-4 py-3
                         rounded-xl mb-6"
              style={{
                backgroundColor: "var(--color-bg-card)",
                border:          "1px solid var(--color-border)",
              }}
            >
              <div>
                <span className="text-xl font-bold"
                      style={{ color: "var(--color-text-heading)" }}>
                  {formatPrice(hasDiscount ? course.discountPrice : course.price)}
                </span>
                {hasDiscount && (
                  <span className="text-sm line-through ml-2"
                        style={{ color: "var(--color-text-muted)" }}>
                    {formatPrice(course.price)}
                  </span>
                )}
              </div>
              <button
                className="btn-primary px-5 py-2 text-sm rounded-xl"
                style={{ backgroundColor: "var(--color-primary)" }}
                onClick={() => {
                  if (!isAuthenticated) navigate("/login");
                  else alert("Enrollment coming in Phase 3!");
                }}
              >
                Enroll Now
              </button>
            </div>

            {/* Desktop sticky card */}
            <div className="hidden lg:block">
              <EnrollCard
                course={course}
                isAuthenticated={isAuthenticated}
                isStudent={isStudent}
              />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default CourseDetail;