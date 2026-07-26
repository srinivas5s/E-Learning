const FileIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
    </svg>
);

const DownloadIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const formatSize = (bytes) => {
    if (!bytes) return "";
    const kb = bytes / 1024;
    if (kb < 1024) return `${Math.round(kb)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
};

const Attachments = ({ attachments = [] }) => {
    if (attachments.length === 0) {
        return (
            <div
                className="rounded-xl p-5 text-center"
                style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
            >
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    No attachments for this lesson
                </p>
            </div>
        );
    }

    return (
        <div
            className="rounded-xl p-5"
            style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
        >
            <h3
                className="text-sm font-bold mb-4"
                style={{ color: "var(--color-text-heading)", fontFamily: "var(--font-heading)" }}
            >
                Attachments
            </h3>
            <div className="space-y-2">
                {attachments.map((file) => (
                    <a
                        key={file._id}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={file.name}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150"
                        style={{ border: "1px solid var(--color-border)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.06)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                        <span style={{ color: "var(--color-primary)" }}>
                            <FileIcon />
                        </span>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color: "var(--color-text)" }}>
                                {file.name}
                            </p>
                            {file.size > 0 && (
                                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                                    {formatSize(file.size)}
                                </p>
                            )}
                        </div>
                        <span style={{ color: "var(--color-text-muted)" }}>
                            <DownloadIcon />
                        </span>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default Attachments;