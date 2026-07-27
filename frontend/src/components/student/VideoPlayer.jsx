const PlayIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
);

const AlertIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

const VideoPlayer = ({ lesson, loading }) => {
    if (loading) {
        return (
            <div
                className="w-full aspect-video rounded-xl flex items-center justify-center animate-pulse"
                style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
            >
                <span style={{ color: "var(--color-text-muted)" }}>
                    <PlayIcon />
                </span>
            </div>
        );
    }

    if (!lesson?.video?.url) {
        return (
            <div
                className="w-full aspect-video rounded-xl flex flex-col items-center justify-center gap-3
                   border-2 border-dashed"
                style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-card)" }}
            >
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                    style={{ backgroundColor: "rgba(99,102,241,0.08)" }}
                >
                    🎬
                </div>
                <div className="text-center px-4">
                    <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                        No video available
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                        This lesson doesn't have a video yet
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="w-full rounded-xl overflow-hidden"
            style={{ backgroundColor: "#000", border: "1px solid var(--color-border)" }}
        >
            <video
                key={lesson._id}
                className="w-full aspect-video"
                controls
                controlsList="nodownload"
                poster={lesson.video.thumbnail || undefined}
                onError={(e) => {
                    e.currentTarget.closest(".video-error-wrap")?.classList.add("has-error");
                }}
            >
                <source src={lesson.video.url} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoPlayer;