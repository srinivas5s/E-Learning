const ChevronLeft = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
    </svg>
);

const ChevronRight = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const LessonNavigation = ({ hasPrev, hasNext, onPrev, onNext, prevTitle, nextTitle }) => {
    return (
        <div
            className="flex items-center justify-between gap-3 px-5 py-4 rounded-xl"
            style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
        >
            <button
                type="button"
                onClick={onPrev}
                disabled={!hasPrev}
                className="btn-ghost flex items-center gap-2 px-4 py-2.5 text-sm"
                style={{ opacity: hasPrev ? 1 : 0.4, cursor: hasPrev ? "pointer" : "not-allowed" }}
            >
                <ChevronLeft />
                <span className="hidden sm:flex flex-col items-start leading-tight">
                    <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Previous</span>
                    {hasPrev && prevTitle && (
                        <span className="text-xs font-medium truncate max-w-[140px]">{prevTitle}</span>
                    )}
                </span>
            </button>

            <button
                type="button"
                onClick={onNext}
                disabled={!hasNext}
                className="btn-primary flex items-center gap-2 px-4 py-2.5 text-sm"
                style={{
                    backgroundColor: "var(--color-primary)",
                    opacity: hasNext ? 1 : 0.4,
                    cursor: hasNext ? "pointer" : "not-allowed",
                }}
            >
                <span className="hidden sm:flex flex-col items-end leading-tight">
                    <span className="text-xs opacity-80">Next</span>
                    {hasNext && nextTitle && (
                        <span className="text-xs font-medium truncate max-w-[140px]">{nextTitle}</span>
                    )}
                </span>
                <ChevronRight />
            </button>
        </div>
    );
};

export default LessonNavigation;