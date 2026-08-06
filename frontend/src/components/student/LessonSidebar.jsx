import PlayerModuleAccordion from "./PlayerModuleAccordion.jsx";

const CloseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const LessonSidebar = ({
    course,
    modules = [],
    activeLessonId,
    onLessonClick,
    mobileOpen,
    onMobileClose,
    isPreviewMode = false,   // new
    completedLessons = [],
}) => {
    const totalLessons = modules.reduce((s, m) => s + (m.lessons?.length || 0), 0);
    const previewCount = modules.reduce(
        (s, m) => s + (m.lessons?.filter((l) => l.isPreview).length || 0), 0
    );

    const content = (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div
                className="flex items-center justify-between px-4 py-3 shrink-0"
                style={{ borderBottom: "1px solid var(--color-border)" }}
            >
                <div className="min-w-0">
                    <h2
                        className="text-sm font-bold truncate"
                        style={{ color: "var(--color-text-heading)", fontFamily: "var(--font-heading)" }}
                    >
                        {course?.title || "Course Content"}
                    </h2>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {isPreviewMode
                            ? `${previewCount} free preview lesson${previewCount === 1 ? "" : "s"}`
                            : `${modules.length} modules · ${totalLessons} lessons`}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onMobileClose}
                    className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg shrink-0
                     transition-colors duration-150"
                    style={{ color: "var(--color-text-muted)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
                >
                    <CloseIcon />
                </button>
            </div>

            {/* Preview mode banner — CTA to enroll */}
            {isPreviewMode && (
                <div
                    className="mx-3 mt-3 px-3 py-2.5 rounded-lg text-center"
                    style={{
                        backgroundColor: "rgba(99,102,241,0.08)",
                        border: "1px solid rgba(99,102,241,0.2)",
                    }}
                >
                    <p className="text-xs font-medium" style={{ color: "var(--color-primary)" }}>
                        🔒 Enroll to unlock the full course
                    </p>
                </div>
            )}

            {/* Scrollable module list */}
            <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
                {modules.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                        <span className="text-3xl mb-3">📋</span>
                        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                            No content available yet
                        </p>
                    </div>
                ) : (
                    modules.map((module, i) => (
                        <PlayerModuleAccordion
                            key={module._id}
                            module={module}
                            index={i}
                            activeLessonId={activeLessonId}
                            onLessonClick={onLessonClick}
                            isPreviewMode={isPreviewMode}
                            completedLessons={completedLessons}   // new

                        />
                    ))
                )}
            </div>
        </div>
    );

    return (
        <>
            <aside
                className="hidden lg:flex flex-col w-72 shrink-0 rounded-xl overflow-hidden"
                style={{
                    backgroundColor: "var(--color-bg-card)",
                    border: "1px solid var(--color-border)",
                    height: "calc(100vh - 64px)",
                    position: "sticky",
                    top: "64px",
                }}
            >
                {content}
            </aside>

            {mobileOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 lg:hidden"
                        style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }}
                        onClick={onMobileClose}
                    />
                    <aside
                        className="fixed top-0 right-0 z-50 h-full w-72 flex flex-col lg:hidden"
                        style={{
                            backgroundColor: "var(--color-bg-card)",
                            borderLeft: "1px solid var(--color-border)",
                        }}
                    >
                        {content}
                    </aside>
                </>
            )}
        </>
    );
};

export default LessonSidebar;