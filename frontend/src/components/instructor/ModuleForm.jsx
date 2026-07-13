import { useState, useEffect } from "react";

const ModuleForm = ({ initial = {}, onSubmit, onCancel, saving }) => {
    const [form, setForm] = useState({ title: "", description: "" });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initial._id) {
            setForm({
                title: initial.title || "",
                description: initial.description || "",
            });
        }
    }, [initial._id]);

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
        onSubmit({ title: form.title.trim(), description: form.description.trim() });
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Title */}
            <div>
                <label className="form-label">Module Title *</label>
                <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Introduction to React"
                    value={form.title}
                    maxLength={150}
                    onChange={(e) => {
                        setForm((p) => ({ ...p, title: e.target.value }));
                        setErrors((p) => ({ ...p, title: "" }));
                    }}
                    style={errors.title ? {
                        borderColor: "var(--color-error)",
                        boxShadow: "0 0 0 3px rgba(248,113,113,0.12)",
                    } : {}}
                />
                {errors.title && (
                    <p className="error-msg">{errors.title}</p>
                )}
            </div>

            {/* Description */}
            <div>
                <label className="form-label">
                    Description
                    <span className="ml-1 font-normal" style={{ color: "var(--color-text-muted)" }}>
                        (optional)
                    </span>
                </label>
                <textarea
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Brief overview of what this module covers..."
                    value={form.description}
                    maxLength={500}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                />
                <p className="text-xs mt-1 text-right" style={{ color: "var(--color-text-muted)" }}>
                    {form.description.length}/500
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-1">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn-ghost px-4 py-2 text-sm"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary px-5 py-2 text-sm"
                    style={{ backgroundColor: "var(--color-primary)" }}
                >
                    {saving ? (
                        <span className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white
                               rounded-full animate-spin" />
                            Saving…
                        </span>
                    ) : initial._id ? "Save Changes" : "Create Module"}
                </button>
            </div>
        </form>
    );
};

export default ModuleForm;