const LessonContent = ({ lesson, loading }) => {
    if (loading) {
        return (
            <div
                className="rounded-xl p-5 animate-pulse space-y-3"
                style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
            >
                <div className="h-4 w-2/3 rounded" style={{ backgroundColor: "var(--color-border)" }} />
                <div className="h-3 w-full rounded" style={{ backgroundColor: "var(--color-border)" }} />
                <div className="h-3 w-4/5 rounded" style={{ backgroundColor: "var(--color-border)" }} />
            </div>
        );
    }

    if (!lesson) return null;

    return (
        <div
            className="rounded-xl p-5"
            style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
        >
            <div className="flex items-start justify-between gap-3 mb-2">
                <h1
                    className="text-lg font-bold"
                    style={{ color: "var(--color-text-heading)", fontFamily: "var(--font-heading)" }}
                >
                    {lesson.title}
                </h1>

                {lesson.isPreview && (
                    <span
                        className="shrink-0 text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ backgroundColor: "rgba(16,185,129,0.12)", color: "#10b981" }}
                    >
                        Free Preview
                    </span>
                )}
            </div>

            {lesson.video?.duration > 0 && (
                <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>
                    {lesson.videoDurationFormatted || `${Math.round(lesson.video.duration / 60)} min`}
                </p>
            )}

            {lesson.description ? (
                <p
                    className="text-sm leading-relaxed whitespace-pre-line"
                    style={{ color: "var(--color-text-muted)" }}
                >
                    {lesson.description}
                </p>
            ) : (
                <p className="text-sm italic" style={{ color: "var(--color-text-muted)" }}>
                    No description provided for this lesson.
                </p>
            )}
        </div>
    );
};

export default LessonContent;