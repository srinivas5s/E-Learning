import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LEVEL_BADGE } from "../../constants/courseConstants.js";
import enrollmentApi from "../../api/enrollment.api.js"; // adjust path if needed

const CalendarIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(undefined, {
        month: "short", day: "numeric", year: "numeric",
    });
};

const EnrolledCourseCard = ({ enrollment }) => {
    const course = enrollment.course;
    const navigate = useNavigate();
    const [resuming, setResuming] = useState(false);

    if (!course) return null;

    const level = LEVEL_BADGE[course.level] || LEVEL_BADGE.beginner;
    const isDraft = course.status === "draft";
    const progress = enrollment.progressPercent || 0;
    const isCompleted = enrollment.status === "completed";

    const handleContinue = async () => {
        setResuming(true);
        try {
            const res = await enrollmentApi.getResumePoint(course._id);
            const lessonId = res.data.data.lessonId;
            navigate(`/courses/${course.slug}/learn?lesson=${lessonId}`);
        } catch (err) {
            // Fallback — land on the player and let it pick a default lesson
            navigate(`/courses/${course.slug}/learn`);
        } finally {
            setResuming(false);
        }
    };

    return (
        <div
            className="flex flex-col rounded-2xl overflow-hidden transition-all duration-300"
            style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.12)";
                e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "var(--color-border)";
            }}
        >
            <div className="relative h-40 flex items-center justify-center overflow-hidden shrink-0"
                style={{ backgroundColor: "rgba(99,102,241,0.06)" }}>
                {course.thumbnail?.url ? (
                    <img src={course.thumbnail.url} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-5xl">📚</span>
                )}

                <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: level.bg, color: level.color, border: `1px solid ${level.color}30` }}>
                    {level.label}
                </span>

                {isDraft && (
                    <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>
                        Draft
                    </span>
                )}

                {isCompleted && !isDraft && (
                    <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: "rgba(16,185,129,0.15)", color: "#10b981" }}>
                        ✓ Completed
                    </span>
                )}
            </div>

            <div className="flex flex-col flex-1 p-4">
                <h3 className="text-sm font-semibold leading-snug mb-1.5 line-clamp-2"
                    style={{ color: "var(--color-text-heading)" }}>
                    {course.title}
                </h3>

                {course.instructor && (
                    <p className="text-xs mb-2 truncate" style={{ color: "var(--color-text-muted)" }}>
                        by {course.instructor.name}
                    </p>
                )}

                <div className="flex items-center gap-3 text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>
                    {course.category && <span>{course.category}</span>}
                </div>

                <div className="flex items-center gap-1.5 text-xs pb-3 mb-3"
                    style={{ color: "var(--color-text-muted)", borderBottom: "1px solid var(--color-border)" }}>
                    <CalendarIcon />
                    Enrolled {formatDate(enrollment.enrolledAt)}
                </div>

                {/* New — progress bar */}
                <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Progress</span>
                        <span className="text-xs font-semibold"
                            style={{ color: isCompleted ? "#10b981" : "var(--color-primary)" }}>
                            {progress}%
                        </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-border)" }}>
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${progress}%`,
                                backgroundColor: isCompleted ? "#10b981" : "var(--color-primary)",
                            }}
                        />
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleContinue}
                    disabled={resuming}
                    className="btn-primary w-full py-2.5 text-sm font-semibold rounded-xl text-center mt-auto"
                    style={{ backgroundColor: "var(--color-primary)" }}
                >
                    {resuming ? "Loading…" : progress > 0 ? "Continue Learning" : "Start Learning"}
                </button>
            </div>
        </div>
    );
};

export default EnrolledCourseCard;