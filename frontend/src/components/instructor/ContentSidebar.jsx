import { useState } from "react";

// ── Icons ─────────────────────────────────────────────────────────────────────
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

const CloseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

// ── Sidebar module row ────────────────────────────────────────────────────────
const SidebarModule = ({ module, index, onLessonClick, activeLesson }) => {
    const [open, setOpen] = useState(true);
    const lessons = module.lessons || [];

    const publishedCount = lessons.filter((l) => l.isPublished).length;

    return (
        <div>
            {/* Module header */}
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left
                   transition-colors duration-150 group"
                style={{ backgroundColor: "transparent" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.06)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
                {/* Order dot */}
                <span
                    className="shrink-0 w-5 h-5 rounded flex items-center justify-center
                     text-xs font-bold"
                    style={{
                        backgroundColor: "rgba(99,102,241,0.12)",
                        color: "var(--color-primary)",
                    }}
                >
                    {index + 1}
                </span>

                {/* Title */}
                <p
                    className="flex-1 text-xs font-semibold truncate"
                    style={{ color: "var(--color-text)" }}
                >
                    {module.title}
                </p>

                {/* Published count */}
                <span className="text-xs shrink-0" style={{ color: "var(--color-text-muted)" }}>
                    {publishedCount}/{lessons.length}
                </span>

                {/* Chevron */}
                <span style={{ color: "var(--color-text-muted)" }}>
                    <ChevronIcon open={open} />
                </span>
            </button>

            {/* Lesson list */}
            {open && lessons.length > 0 && (
                <div className="ml-5 mt-0.5 space-y-0.5 mb-1">
                    {lessons.map((lesson, li) => {
                        const isActive = activeLesson === lesson._id;
                        return (
                            <button
                                key={lesson._id}
                                type="button"
                                onClick={() => onLessonClick?.(module._id, lesson._id)}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg
                           text-left transition-all duration-100"
                                style={{
                                    backgroundColor: isActive
                                        ? "rgba(99,102,241,0.12)" : "transparent",
                                    borderLeft: isActive
                                        ? "2px solid var(--color-primary)" : "2px solid transparent",
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive)
                                        e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.05)";
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive)
                                        e.currentTarget.style.backgroundColor = "transparent";
                                }}
                            >
                                {/* Video icon */}
                                <span style={{
                                    color: lesson.video?.url
                                        ? "var(--color-primary)" : "var(--color-border)",
                                }}>
                                    <VideoIcon />
                                </span>

                                {/* Lesson title */}
                                <p
                                    className="flex-1 text-xs truncate"
                                    style={{
                                        color: isActive
                                            ? "var(--color-primary)" : "var(--color-text-muted)",
                                        fontWeight: isActive ? 600 : 400,
                                    }}
                                >
                                    {li + 1}. {lesson.title}
                                </p>

                                {/* Status dot */}
                                <span
                                    className="shrink-0 w-1.5 h-1.5 rounded-full"
                                    style={{
                                        backgroundColor: lesson.isPublished ? "#10b981" : "var(--color-border)",
                                    }}
                                    title={lesson.isPublished ? "Published" : "Draft"}
                                />
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Empty lessons hint */}
            {open && lessons.length === 0 && (
                <p className="ml-7 text-xs py-1.5 italic" style={{ color: "var(--color-text-muted)" }}>
                    No lessons yet
                </p>
            )}
        </div>
    );
};

// ── Stats strip ───────────────────────────────────────────────────────────────
const StatsStrip = ({ modules }) => {
    const totalLessons = modules.reduce((s, m) => s + (m.lessons?.length || 0), 0);
    const publishedLesson = modules.reduce(
        (s, m) => s + (m.lessons?.filter((l) => l.isPublished).length || 0), 0
    );
    const publishedMods = modules.filter((m) => m.isPublished).length;

    return (
        <div
            className="grid grid-cols-3 gap-2 p-3 rounded-xl mb-4"
            style={{ backgroundColor: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.12)" }}
        >
            {[
                { value: modules.length, label: "Modules" },
                { value: totalLessons, label: "Lessons" },
                { value: publishedLesson, label: "Live" },
            ].map(({ value, label }) => (
                <div key={label} className="text-center">
                    <p
                        className="text-base font-bold"
                        style={{ color: "var(--color-primary)", fontFamily: "var(--font-heading)" }}
                    >
                        {value}
                    </p>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {label}
                    </p>
                </div>
            ))}
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const ContentSidebar = ({
    modules = [],
    activeLesson,
    onLessonClick,
    // mobile
    mobileOpen,
    onMobileClose,
}) => {
    const content = (
        <div className="flex flex-col h-full">

            {/* Header */}
            <div
                className="flex items-center justify-between px-4 py-3 shrink-0"
                style={{ borderBottom: "1px solid var(--color-border)" }}
            >
                <h2
                    className="text-sm font-bold"
                    style={{ color: "var(--color-text-heading)", fontFamily: "var(--font-heading)" }}
                >
                    Course Outline
                </h2>

                {/* Mobile close button */}
                <button
                    type="button"
                    onClick={onMobileClose}
                    className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg
                     transition-colors duration-150"
                    style={{ color: "var(--color-text-muted)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
                >
                    <CloseIcon />
                </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">

                {/* Stats */}
                {modules.length > 0 && (
                    <div className="px-1 mb-2">
                        <StatsStrip modules={modules} />
                    </div>
                )}

                {/* Module list */}
                {modules.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                        <span className="text-3xl mb-3">📋</span>
                        <p className="text-xs font-medium mb-1" style={{ color: "var(--color-text)" }}>
                            No modules yet
                        </p>
                        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                            Add your first module to get started
                        </p>
                    </div>
                ) : (
                    modules.map((module, i) => (
                        <SidebarModule
                            key={module._id}
                            module={module}
                            index={i}
                            activeLesson={activeLesson}
                            onLessonClick={onLessonClick}
                        />
                    ))
                )}
            </div>

            {/* Footer — publish progress */}
            {modules.length > 0 && (
                <div
                    className="shrink-0 px-4 py-3"
                    style={{ borderTop: "1px solid var(--color-border)" }}
                >
                    {(() => {
                        const total = modules.reduce((s, m) => s + (m.lessons?.length || 0), 0);
                        const published = modules.reduce(
                            (s, m) => s + (m.lessons?.filter((l) => l.isPublished).length || 0), 0
                        );
                        const pct = total > 0 ? Math.round((published / total) * 100) : 0;
                        return (
                            <>
                                <div className="flex justify-between text-xs mb-1.5"
                                    style={{ color: "var(--color-text-muted)" }}>
                                    <span>Published</span>
                                    <span style={{ color: pct === 100 ? "#10b981" : "var(--color-primary)" }}>
                                        {pct}%
                                    </span>
                                </div>
                                <div
                                    className="h-1.5 rounded-full overflow-hidden"
                                    style={{ backgroundColor: "var(--color-border)" }}
                                >
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${pct}%`,
                                            backgroundColor: pct === 100 ? "#10b981" : "var(--color-primary)",
                                        }}
                                    />
                                </div>
                            </>
                        );
                    })()}
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Desktop — always visible */}
            <aside
                className="hidden lg:flex flex-col w-64 shrink-0 rounded-xl overflow-hidden"
                style={{
                    backgroundColor: "var(--color-bg-card)",
                    border: "1px solid var(--color-border)",
                    height: "calc(100vh - 120px)",
                    position: "sticky",
                    top: "80px",
                }}
            >
                {content}
            </aside>

            {/* Mobile — slide-in drawer */}
            {mobileOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40 lg:hidden"
                        style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }}
                        onClick={onMobileClose}
                    />
                    {/* Drawer */}
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

export default ContentSidebar;