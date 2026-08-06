import { useState } from "react";

const ChevronIcon = ({ open }) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        style={{
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.15s ease",
        }}>
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const VideoIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" />
    </svg>
);

const LockIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const CheckIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
        stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const PlayerModuleAccordion = ({
    module,
    index,
    activeLessonId,
    onLessonClick,
    isPreviewMode = false,
    completedLessons = [],
}) => {
    const [open, setOpen] = useState(true);
    const lessons = module.lessons || [];

    return (
        <div>
            {/* Module header — unchanged */}
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left
                   transition-colors duration-150"
                style={{ backgroundColor: "transparent" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.06)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
                <span
                    className="shrink-0 w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: "rgba(99,102,241,0.12)", color: "var(--color-primary)" }}
                >
                    {index + 1}
                </span>

                <p className="flex-1 text-xs font-semibold truncate" style={{ color: "var(--color-text)" }}>
                    {module.title}
                </p>

                <span className="text-xs shrink-0" style={{ color: "var(--color-text-muted)" }}>
                    {lessons.length}
                </span>

                <span style={{ color: "var(--color-text-muted)" }}>
                    <ChevronIcon open={open} />
                </span>
            </button>

            {/* Lesson list */}
            {open && lessons.length > 0 && (
                <div className="ml-5 mt-0.5 space-y-0.5 mb-1">
                    {lessons.map((lesson, li) => {
                        const isActive = activeLessonId === lesson._id;
                        const isLocked = isPreviewMode && !lesson.isPreview;
                        const isDone = completedLessons.some(
                            (id) => id === lesson._id || id?._id === lesson._id
                        );

                        return (
                            <button
                                key={lesson._id}
                                type="button"
                                onClick={() => onLessonClick?.(module._id, lesson._id)}
                                disabled={isLocked}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg
                           text-left transition-all duration-100"
                                style={{
                                    backgroundColor: isActive ? "rgba(99,102,241,0.12)" : "transparent",
                                    borderLeft: isActive
                                        ? "2px solid var(--color-primary)" : "2px solid transparent",
                                    opacity: isLocked ? 0.5 : 1,
                                    cursor: isLocked ? "not-allowed" : "pointer",
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive && !isLocked)
                                        e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.05)";
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive && !isLocked)
                                        e.currentTarget.style.backgroundColor = "transparent";
                                }}
                            >
                                <span style={{
                                    color: isLocked
                                        ? "var(--color-text-muted)"
                                        : isDone
                                            ? "#10b981"
                                            : lesson.video?.url ? "var(--color-primary)" : "var(--color-border)",
                                }}>
                                    {isLocked ? <LockIcon /> : isDone ? <CheckIcon /> : <VideoIcon />}
                                </span>

                                <p
                                    className="flex-1 text-xs truncate"
                                    style={{
                                        color: isActive ? "var(--color-primary)" : "var(--color-text-muted)",
                                        fontWeight: isActive ? 600 : 400,
                                    }}
                                >
                                    {li + 1}. {lesson.title}
                                </p>

                                {isLocked ? (
                                    <span
                                        className="shrink-0 text-xs px-1.5 py-0.5 rounded-full font-medium"
                                        style={{
                                            backgroundColor: "var(--color-border)",
                                            color: "var(--color-text-muted)",
                                        }}
                                    >
                                        Locked
                                    </span>
                                ) : lesson.isPreview && (
                                    <span
                                        className="shrink-0 text-xs px-1.5 py-0.5 rounded-full font-medium"
                                        style={{ backgroundColor: "rgba(16,185,129,0.12)", color: "#10b981" }}
                                    >
                                        Preview
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            {open && lessons.length === 0 && (
                <p className="ml-7 text-xs py-1.5 italic" style={{ color: "var(--color-text-muted)" }}>
                    No lessons yet
                </p>
            )}
        </div>
    );
};

export default PlayerModuleAccordion;