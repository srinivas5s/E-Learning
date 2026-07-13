import { useState, useEffect } from "react";

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

// ── Main ──────────────────────────────────────────────────────────────────────
const LessonForm = ({ initial = {}, onSubmit, onCancel, saving }) => {
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

            {/* Details */}
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

            {/* Video placeholder */}
            <Section title="Video Content">
                <div
                    className="flex flex-col items-center justify-center gap-3 py-10
                     rounded-xl border-2 border-dashed"
                    style={{ borderColor: "var(--color-border)" }}
                >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                        style={{ backgroundColor: "rgba(99,102,241,0.08)" }}>
                        🎬
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                            Video upload — Phase 3C
                        </p>
                        <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                            Cloudinary video integration coming next
                        </p>
                    </div>
                    {isEdit && initial.video?.url && (
                        <p className="text-xs px-3 py-2 rounded-lg"
                            style={{
                                backgroundColor: "rgba(16,185,129,0.08)", color: "#10b981",
                                border: "1px solid rgba(16,185,129,0.2)"
                            }}>
                            ✓ Video already uploaded
                        </p>
                    )}
                </div>
            </Section>

            {/* Settings */}
            <Section title="Settings">
                <Toggle
                    label="Free Preview"
                    hint="Allow non-enrolled students to watch this lesson for free"
                    checked={form.isPreview}
                    onChange={(val) => set("isPreview", val)}
                />
            </Section>

            {/* Actions bar */}
            <div
                className="flex items-center justify-between gap-3 px-5 py-4 rounded-xl"
                style={{
                    backgroundColor: "var(--color-bg-card)",
                    border: "1px solid var(--color-border)",
                }}
            >
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {isEdit ? "Changes save immediately." : "Saves as draft. Publish after adding video."}
                </p>
                <div className="flex items-center gap-3">
                    <button type="button" onClick={onCancel} className="btn-ghost px-4 py-2.5 text-sm">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
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