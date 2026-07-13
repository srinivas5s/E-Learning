import { useState } from "react";

// ── Icons ─────────────────────────────────────────────────────────────────────
const VideoIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
);
const EditIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);
const TrashIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
    </svg>
);
const EyeIcon = ({ off }) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        {off ? (
            <>
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
            </>
        ) : (
            <>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
            </>
        )}
    </svg>
);
const ArrowUpIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <polyline points="18 15 12 9 6 15" />
    </svg>
);
const ArrowDownIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

// ── Inline delete confirm ─────────────────────────────────────────────────────
const InlineDeleteConfirm = ({ onConfirm, onCancel, saving }) => (
    <div
        className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg mt-2"
        style={{
            backgroundColor: "rgba(248,113,113,0.08)",
            border: "1px solid rgba(248,113,113,0.2)",
        }}
    >
        <p className="text-xs" style={{ color: "var(--color-error)" }}>
            Delete this lesson permanently?
        </p>
        <div className="flex gap-2 shrink-0">
            <button
                onClick={onCancel}
                className="text-xs px-2.5 py-1 rounded-md font-medium"
                style={{ color: "var(--color-text-muted)", backgroundColor: "var(--color-bg-card)" }}
            >
                Cancel
            </button>
            <button
                onClick={onConfirm}
                disabled={saving}
                className="text-xs px-2.5 py-1 rounded-md font-semibold text-white
                   disabled:opacity-60"
                style={{ backgroundColor: "var(--color-error)" }}
            >
                {saving ? "Deleting…" : "Delete"}
            </button>
        </div>
    </div>
);

// ── Lesson Card ───────────────────────────────────────────────────────────────
const LessonCard = ({
    lesson,
    index,
    total,
    saving,
    onEdit,
    onDelete,
    onTogglePublish,
    onMoveUp,
    onMoveDown,
}) => {
    const [confirming, setConfirming] = useState(false);

    const hasVideo = !!lesson.video?.url;
    const isFirst = index === 0;
    const isLast = index === total - 1;

    const handleDelete = async () => {
        await onDelete();
        setConfirming(false);
    };

    const formatDuration = (secs) => {
        if (!secs) return null;
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${String(s).padStart(2, "0")}`;
    };

    return (
        <div
            className="rounded-lg transition-all duration-150 group"
            style={{
                backgroundColor: "var(--color-bg-card)",
                border: "1px solid var(--color-border)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
        >
            <div className="flex items-center gap-2.5 px-3 py-2.5">

                {/* Up / down reorder */}
                <div className="flex flex-col gap-0.5 shrink-0">
                    <ReorderBtn
                        onClick={onMoveUp}
                        disabled={isFirst || saving}
                        title="Move up"
                    >
                        <ArrowUpIcon />
                    </ReorderBtn>
                    <ReorderBtn
                        onClick={onMoveDown}
                        disabled={isLast || saving}
                        title="Move down"
                    >
                        <ArrowDownIcon />
                    </ReorderBtn>
                </div>

                {/* Index */}
                <span
                    className="shrink-0 w-5 h-5 rounded flex items-center justify-center
                     text-xs font-semibold"
                    style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text-muted)" }}
                >
                    {index + 1}
                </span>

                {/* Video dot */}
                <span
                    className="shrink-0"
                    title={hasVideo ? "Has video" : "No video"}
                    style={{ color: hasVideo ? "var(--color-primary)" : "var(--color-border)" }}
                >
                    <VideoIcon />
                </span>

                {/* Title + meta */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--color-text)" }}>
                        {lesson.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {formatDuration(lesson.video?.duration) && (
                            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                                {formatDuration(lesson.video.duration)}
                            </span>
                        )}
                        {lesson.isPreview && (
                            <span
                                className="text-xs font-medium px-1.5 py-0.5 rounded"
                                style={{ backgroundColor: "rgba(14,165,233,0.1)", color: "#0ea5e9" }}
                            >
                                Free preview
                            </span>
                        )}
                    </div>
                </div>

                {/* Status badge */}
                <span
                    className="hidden sm:inline-flex shrink-0 text-xs font-semibold
                     px-2 py-0.5 rounded-full"
                    style={{
                        backgroundColor: lesson.isPublished
                            ? "rgba(16,185,129,0.1)" : "rgba(148,163,184,0.1)",
                        color: lesson.isPublished ? "#10b981" : "var(--color-text-muted)",
                    }}
                >
                    {lesson.isPublished ? "Live" : "Draft"}
                </span>

                {/* Actions — visible on hover */}
                <div
                    className="flex items-center gap-1 shrink-0 opacity-0
                     group-hover:opacity-100 transition-opacity duration-150"
                >
                    <LessonActionBtn
                        title={lesson.isPublished ? "Unpublish" : "Publish"}
                        onClick={onTogglePublish}
                        activeColor={lesson.isPublished ? "#f87171" : "#10b981"}
                    >
                        <EyeIcon off={lesson.isPublished} />
                    </LessonActionBtn>

                    <LessonActionBtn title="Edit lesson" onClick={onEdit}>
                        <EditIcon />
                    </LessonActionBtn>

                    <LessonActionBtn
                        title="Delete lesson"
                        onClick={() => setConfirming(true)}
                        activeColor="var(--color-error)"
                    >
                        <TrashIcon />
                    </LessonActionBtn>
                </div>
            </div>

            {/* Inline delete confirm */}
            {confirming && (
                <div className="px-3 pb-3">
                    <InlineDeleteConfirm
                        onConfirm={handleDelete}
                        onCancel={() => setConfirming(false)}
                        saving={saving}
                    />
                </div>
            )}
        </div>
    );
};

// ── Small buttons ─────────────────────────────────────────────────────────────
const ReorderBtn = ({ children, onClick, disabled, title }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className="w-5 h-5 flex items-center justify-center rounded transition-colors
               duration-100 disabled:opacity-20 disabled:cursor-not-allowed"
        style={{ color: "var(--color-text-muted)" }}
        onMouseEnter={(e) => !disabled && (e.currentTarget.style.color = "var(--color-primary)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
    >
        {children}
    </button>
);

const LessonActionBtn = ({ children, title, onClick, activeColor }) => (
    <button
        type="button"
        title={title}
        onClick={onClick}
        className="w-6 h-6 flex items-center justify-center rounded transition-all duration-100"
        style={{ color: "var(--color-text-muted)" }}
        onMouseEnter={(e) => {
            e.currentTarget.style.color = activeColor || "var(--color-primary)";
            e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.08)";
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--color-text-muted)";
            e.currentTarget.style.backgroundColor = "transparent";
        }}
    >
        {children}
    </button>
);

export default LessonCard;