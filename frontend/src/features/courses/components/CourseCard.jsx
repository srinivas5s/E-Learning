import { Link } from "react-router-dom";
import {
  formatPrice,
  formatDuration,
  LEVEL_BADGE,
} from "../courseConstants.js";

// ── Star rating ───────────────────────────────────────────────────────────────
const Stars = ({ rating }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} width="12" height="12" viewBox="0 0 24 24"
           fill={i < Math.round(rating) ? "#f59e0b" : "none"}
           stroke="#f59e0b" strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02
                         12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
  </div>
);

// ── Course Card ───────────────────────────────────────────────────────────────
const CourseCard = ({ course }) => {
  const level   = LEVEL_BADGE[course.level] || LEVEL_BADGE.beginner;
  const hasDiscount = course.discountPrice > 0 && course.discountPrice < course.price;
  const effectivePrice = hasDiscount ? course.discountPrice : course.price;

  return (
    <Link
      to={`/courses/${course.slug}`}
      className="flex flex-col rounded-2xl overflow-hidden transition-all duration-300 group"
      style={{
        backgroundColor: "var(--color-bg-card)",
        border:          "1px solid var(--color-border)",
        textDecoration:  "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform   = "translateY(-4px)";
        e.currentTarget.style.boxShadow   = "0 16px 40px rgba(0,0,0,0.12)";
        e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform   = "translateY(0)";
        e.currentTarget.style.boxShadow   = "none";
        e.currentTarget.style.borderColor = "var(--color-border)";
      }}
    >
      {/* Thumbnail */}
      <div
        className="relative h-44 flex items-center justify-center overflow-hidden shrink-0"
        style={{ backgroundColor: "rgba(99,102,241,0.06)" }}
      >
        {course.thumbnail?.url ? (
          <img
            src={course.thumbnail.url}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-300
                       group-hover:scale-105"
          />
        ) : (
          <span className="text-5xl transition-transform duration-300 group-hover:scale-110">
            📚
          </span>
        )}

        {/* Level badge */}
        <span
          className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: level.bg, color: level.color, border: `1px solid ${level.color}30` }}
        >
          {level.label}
        </span>

        {/* Discount badge */}
        {hasDiscount && (
          <span
            className="absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full text-white"
            style={{ backgroundColor: "#ef4444" }}
          >
            {Math.round((1 - course.discountPrice / course.price) * 100)}% OFF
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">

        {/* Title */}
        <h3
          className="text-sm font-semibold leading-snug mb-2 line-clamp-2
                     transition-colors duration-150 group-hover:text-[var(--color-primary)]"
          style={{ color: "var(--color-text-heading)" }}
        >
          {course.title}
        </h3>

        {/* Instructor */}
        {course.instructor && (
          <p className="text-xs mb-3 truncate" style={{ color: "var(--color-text-muted)" }}>
            by {course.instructor.name}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-xs font-bold" style={{ color: "#f59e0b" }}>
            {course.averageRating > 0 ? course.averageRating : "New"}
          </span>
          {course.averageRating > 0 && <Stars rating={course.averageRating} />}
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {course.totalRatings > 0 && `(${course.totalRatings.toLocaleString()})`}
          </span>
        </div>

        {/* Meta */}
        <div
          className="flex items-center gap-3 text-xs pb-3 mb-3"
          style={{ color: "var(--color-text-muted)", borderBottom: "1px solid var(--color-border)" }}
        >
          {course.duration > 0 && (
            <span className="flex items-center gap-1">
              🕐 {formatDuration(course.duration)}
            </span>
          )}
          {course.studentsEnrolled > 0 && (
            <span className="flex items-center gap-1">
              👥 {course.studentsEnrolled.toLocaleString()}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-2">
            <span
              className="text-base font-bold"
              style={{ color: "var(--color-text-heading)", fontFamily: "var(--font-heading)" }}
            >
              {formatPrice(effectivePrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs line-through" style={{ color: "var(--color-text-muted)" }}>
                {formatPrice(course.price)}
              </span>
            )}
          </div>
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-lg transition-colors duration-150
                       group-hover:text-white"
            style={{
              backgroundColor: "rgba(99,102,241,0.08)",
              color:           "var(--color-primary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-primary)";
              e.currentTarget.style.color           = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.08)";
              e.currentTarget.style.color           = "var(--color-primary)";
            }}
          >
            View →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;