import { useState, useEffect, useRef } from "react";

// ── New icons for upload UI ───────────────────────────────────────────────────
const UploadCloudIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
        <path d="M12 12v9" />
        <path d="m16 16-4-4-4 4" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const AlertCircleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="var(--color-error)" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

const PlayCircleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="var(--color-primary)" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" fill="var(--color-primary)" />
    </svg>
);

const Section = ({ title, children }) => (
    <div className="rounded-xl p-5"
        style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
        <h3 className="text-sm font-bold mb-4"
            style={{ color: "var(--color-text-heading)", fontFamily: "var(--font-heading)" }}>
            {title}
        </h3>
        <div className="space-y-4">{children}</div>
    </div>
);

const Toggle = ({ label, hint, checked, onChange }) => (
    <div className="flex items-start justify-between gap-4">
        <div>
            <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{label}</p>
            {hint && <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{hint}</p>}
        </div>
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className="shrink-0 relative rounded-full transition-colors duration-200"
            style={{
                width: "40px",
                height: "22px",
                backgroundColor: checked ? "var(--color-primary)" : "var(--color-border)",
            }}
        >
            <span
                className="absolute bg-white rounded-full shadow transition-transform duration-200"
                style={{
                    width: "18px",
                    height: "18px",
                    top: "2px",
                    left: "2px",
                    transform: checked ? "translateX(18px)" : "translateX(0)",
                }}
            />
        </button>
    </div>
);

const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB — matches backend multer limit

const formatBytes = (bytes) => {
    if (!bytes) return "";
    const mb = bytes / (1024 * 1024);
    return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(1)} MB`;
};

// ── Video upload widget ────────────────────────────────────────────────────────
const VideoUploadField = ({ existingVideo, onVideoUpload, uploading, uploadProgress }) => {
    const [dragActive, setDragActive] = useState(false);
    const [localError, setLocalError] = useState("");
    const [pendingFile, setPendingFile] = useState(null); // selected but not yet uploaded
    const [lastUploadOk, setLastUploadOk] = useState(false);
    const inputRef = useRef(null);

    const validateFile = (file) => {
        if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
            return "Invalid format. Allowed: MP4, WebM, MOV";
        }
        if (file.size > MAX_VIDEO_SIZE) {
            return "File too large. Maximum size is 500MB";
        }
        return "";
    };

    const startUpload = async (file) => {
        const err = validateFile(file);
        if (err) {
            setLocalError(err);
            setPendingFile(null);
            return;
        }
        setLocalError("");
        setLastUploadOk(false);
        setPendingFile(file);

        const result = await onVideoUpload(file);

        if (result) {
            setLastUploadOk(true);
            setPendingFile(null);
        }
        // On failure, keep pendingFile so the user can see what failed and retry
    };

    const handleInputChange = (e) => {
        const file = e.target.files?.[0];
        if (file) startUpload(file);
        e.target.value = ""; // allow re-selecting the same file after a retry
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) startUpload(file);
    };

    const handleRetry = () => {
        if (pendingFile) startUpload(pendingFile);
    };

    const handleRemoveSelection = () => {
        setPendingFile(null);
        setLocalError("");
    };

    // ── Uploading state ──────────────────────────────────────────────────────────
    if (uploading) {
        return (
            <div className="rounded-xl border-2 border-dashed p-6"
                style={{ borderColor: "var(--color-primary)", backgroundColor: "rgba(99,102,241,0.04)" }}>
                <div className="flex items-center gap-3 mb-3">
                    <span className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                        style={{ borderColor: "var(--color-primary)", borderTopColor: "transparent" }} />
                    <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                        Uploading {pendingFile?.name}…
                    </p>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-border)" }}>
                    <div
                        className="h-full rounded-full transition-all duration-200"
                        style={{ width: `${uploadProgress}%`, backgroundColor: "var(--color-primary)" }}
                    />
                </div>
                <div className="flex justify-between mt-1.5">
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {pendingFile ? formatBytes(pendingFile.size) : ""}
                    </p>
                    <p className="text-xs font-semibold" style={{ color: "var(--color-primary)" }}>
                        {uploadProgress}%
                    </p>
                </div>
            </div>
        );
    }

    // ── Failed upload — retry state ───────────────────────────────────────────────
    if (pendingFile && localError === "") {
        // upload attempted, promise resolved falsy (server-side failure toast already shown)
        return (
            <div className="rounded-xl border-2 border-dashed p-6 flex flex-col items-center gap-3 text-center"
                style={{ borderColor: "var(--color-error)", backgroundColor: "rgba(248,113,113,0.05)" }}>
                <AlertCircleIcon />
                <div>
                    <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                        Upload failed
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                        {pendingFile.name} · {formatBytes(pendingFile.size)}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button type="button" onClick={handleRetry}
                        className="btn-primary px-4 py-2 text-xs" style={{ backgroundColor: "var(--color-primary)" }}>
                        Retry Upload
                    </button>
                    <button type="button" onClick={handleRemoveSelection} className="btn-ghost px-4 py-2 text-xs">
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    // ── Existing video — replace option ───────────────────────────────────────────
    if (existingVideo?.url) {
        return (
            <div>
                <div className="rounded-xl overflow-hidden mb-3"
                    style={{ border: "1px solid var(--color-border)", backgroundColor: "#000" }}>
                    <video src={existingVideo.url} controls className="w-full aspect-video"
                        poster={existingVideo.thumbnail || undefined} />
                </div>
                <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg"
                    style={{ backgroundColor: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
                    <div className="flex items-center gap-2">
                        <CheckCircleIcon />
                        <p className="text-xs font-medium" style={{ color: "#10b981" }}>
                            Video uploaded
                        </p>
                    </div>
                    <button type="button" onClick={() => inputRef.current?.click()}
                        className="text-xs font-semibold underline" style={{ color: "var(--color-primary)" }}>
                        Replace Video
                    </button>
                </div>
                <input ref={inputRef} type="file" accept="video/mp4,video/webm,video/quicktime"
                    className="hidden" onChange={handleInputChange} />
                {localError && (
                    <p className="error-msg mt-2 flex items-center gap-1.5">
                        <AlertCircleIcon /> {localError}
                    </p>
                )}
            </div>
        );
    }

    // ── Just finished uploading successfully (no existingVideo prop update yet) ──
    if (lastUploadOk) {
        return (
            <div className="rounded-xl p-5 flex items-center gap-3"
                style={{ backgroundColor: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <CheckCircleIcon />
                <p className="text-sm font-medium" style={{ color: "#10b981" }}>
                    Video uploaded successfully
                </p>
            </div>
        );
    }

    // ── Empty state — drag & drop / browse ────────────────────────────────────────
    return (
        <div>
            <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 py-10 rounded-xl
                   border-2 border-dashed cursor-pointer transition-colors duration-150"
                style={{
                    borderColor: dragActive ? "var(--color-primary)" : "var(--color-border)",
                    backgroundColor: dragActive ? "rgba(99,102,241,0.06)" : "transparent",
                }}
            >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "rgba(99,102,241,0.08)", color: "var(--color-primary)" }}>
                    <UploadCloudIcon />
                </div>
                <div className="text-center">
                    <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                        Drag & drop your video here
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                        or <span style={{ color: "var(--color-primary)" }} className="font-semibold">browse files</span>
                    </p>
                    <p className="text-xs mt-2" style={{ color: "var(--color-text-muted)" }}>
                        MP4, WebM, or MOV · up to 500MB
                    </p>
                </div>
            </div>
            <input ref={inputRef} type="file" accept="video/mp4,video/webm,video/quicktime"
                className="hidden" onChange={handleInputChange} />
            {localError && (
                <p className="error-msg mt-2 flex items-center gap-1.5">
                    <AlertCircleIcon /> {localError}
                </p>
            )}
        </div>
    );
};

// ── Main LessonForm — only the Video section + props changed ──────────────────
const LessonForm = ({
    initial = {},
    onSubmit,
    onCancel,
    saving,
    onVideoUpload,     // new
    uploading,         // new
    uploadProgress,    // new
}) => {
    const isEdit = !!initial._id;

    const [form, setForm] = useState({ title: "", description: "", isPreview: false });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEdit) {
            setForm({
                title: initial.title || "",
                description: initial.description || "",
                isPreview: initial.isPreview || false,
            });
        }
    }, [initial._id]);

    const set = (field, val) => {
        setForm((p) => ({ ...p, [field]: val }));
        setErrors((p) => ({ ...p, [field]: "" }));
    };

    const validate = () => {
        const e = {};
        if (!form.title.trim()) e.title = "Title is required";
        else if (form.title.length < 3) e.title = "Min 3 characters";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        onSubmit({
            title: form.title.trim(),
            description: form.description.trim(),
            isPreview: form.isPreview,
        });
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Details — unchanged */}
            <Section title="Lesson Details">
                <div>
                    <label className="form-label">Lesson Title *</label>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. Introduction to useState Hook"
                        value={form.title}
                        maxLength={150}
                        onChange={(e) => set("title", e.target.value)}
                        style={errors.title ? {
                            borderColor: "var(--color-error)",
                            boxShadow: "0 0 0 3px rgba(248,113,113,0.12)",
                        } : {}}
                    />
                    {errors.title && <p className="error-msg">{errors.title}</p>}
                </div>

                <div>
                    <label className="form-label">
                        Description
                        <span className="ml-1 font-normal" style={{ color: "var(--color-text-muted)" }}>
                            (optional)
                        </span>
                    </label>
                    <textarea
                        rows={4}
                        className="input-field resize-none"
                        placeholder="What will students learn in this lesson?"
                        value={form.description}
                        maxLength={2000}
                        onChange={(e) => set("description", e.target.value)}
                    />
                    <p className="text-xs mt-1 text-right" style={{ color: "var(--color-text-muted)" }}>
                        {form.description.length}/2000
                    </p>
                </div>
            </Section>

            {/* Video — replaced placeholder with real upload widget */}
            <Section title="Video Content">
                {isEdit ? (
                    <VideoUploadField
                        existingVideo={initial.video}
                        onVideoUpload={onVideoUpload}
                        uploading={uploading}
                        uploadProgress={uploadProgress}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center gap-3 py-10
                             rounded-xl border-2 border-dashed"
                        style={{ borderColor: "var(--color-border)" }}>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                            style={{ backgroundColor: "rgba(99,102,241,0.08)" }}>
                            🎬
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                                Save the lesson first
                            </p>
                            <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                                Video upload becomes available after creating this lesson
                            </p>
                        </div>
                    </div>
                )}
            </Section>

            {/* Settings — unchanged */}
            <Section title="Settings">
                <Toggle
                    label="Free Preview"
                    hint="Allow non-enrolled students to watch this lesson for free"
                    checked={form.isPreview}
                    onChange={(val) => set("isPreview", val)}
                />
            </Section>

            {/* Actions bar — disabled while uploading added */}
            <div className="flex items-center justify-between gap-3 px-5 py-4 rounded-xl"
                style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {isEdit ? "Changes save immediately." : "Saves as draft. Publish after adding video."}
                </p>
                <div className="flex items-center gap-3">
                    <button type="button" onClick={onCancel} className="btn-ghost px-4 py-2.5 text-sm">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving || uploading}
                        className="btn-primary px-5 py-2.5 text-sm"
                        style={{ backgroundColor: "var(--color-primary)" }}
                    >
                        {saving ? (
                            <span className="flex items-center gap-2">
                                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white
                                 rounded-full animate-spin" />
                                Saving…
                            </span>
                        ) : isEdit ? "Save Changes" : "Create Lesson"}
                    </button>
                </div>
            </div>

        </form>
    );
};

export default LessonForm;