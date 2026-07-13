import { useState } from "react";
import ModuleForm from "./ModuleForm.jsx";

// ── Icons ─────────────────────────────────────────────────────────────────────
const ChevronIcon = ({ open }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const DragIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="9" cy="7" r="1" fill="currentColor" />
        <circle cx="9" cy="12" r="1" fill="currentColor" />
        <circle cx="9" cy="17" r="1" fill="currentColor" />
        <circle cx="15" cy="7" r="1" fill="currentColor" />
        <circle cx="15" cy="12" r="1" fill="currentColor" />
        <circle cx="15" cy="17" r="1" fill="currentColor" />
    </svg>
);

const EditIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const TrashIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
);

const EyeIcon = ({ off }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
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

// ── Delete confirm modal ──────────────────────────────────────────────────────
const DeleteConfirm = ({ title, onConfirm, onCancel, saving }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
        <div className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
            style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4"
                style={{ backgroundColor: "rgba(248,113,113,0.1)" }}>🗑️</div>
            <h3 className="text-base font-bold mb-2"
                style={{ color: "var(--color-text-heading)", fontFamily: "var(--font-heading)" }}>
                Delete Module?
            </h3>
            <p className="text-sm mb-1" style={{ color: "var(--color-text-muted)" }}>
                This will permanently delete
            </p>
            <p className="text-sm font-semibold mb-3" style={{ color: "var(--color-text)" }}>
                "{title}"
            </p>
            <p className="text-xs px-3 py-2 rounded-lg mb-5"
                style={{ backgroundColor: "rgba(248,113,113,0.08)", color: "var(--color-error)" }}>
                All lessons inside this module will also be deleted.
            </p>
            <div className="flex gap-3">
                <button onClick={onCancel} className="flex-1 btn-ghost py-2 text-sm">Cancel</button>
                <button
                    onClick={onConfirm}
                    disabled={saving}
                    className="flex-1 py-2 rounded-lg text-sm font-semibold text-white
                     transition-all duration-150 disabled:opacity-60"
                    style={{ backgroundColor: "var(--color-error)" }}
                >
                    {saving ? "Deleting…" : "Yes, Delete"}
                </button>
            </div>
        </div>
    </div>
);

// ── Module Card ───────────────────────────────────────────────────────────────
const ModuleCard = ({
    module,
    index,
    isOpen,
    onToggle,
    onUpdate,
    onDelete,
    onPublish,
    saving,
    dragHandleProps,
}) => {
    const [editing, setEditing] = useState(false);
    const [confirming, setConfirming] = useState(false);

    const lessonCount = module.lessons?.length || 0;

    const handleUpdate = async (data) => {
        const ok = await onUpdate(module._id, data);
        if (ok !== null) setEditing(false);
    };

    const handleDelete = async () => {
        const ok = await onDelete(module._id);
        if (ok) setConfirming(false);
    };

    return (
        <>
            <div
                className="rounded-xl overflow-hidden transition-all duration-200"
                style={{
                    backgroundColor: "var(--color-bg-card)",
                    border: isOpen
                        ? "1px solid rgba(99,102,241,0.4)"
                        : "1px solid var(--color-border)",
                    boxShadow: isOpen ? "0 0 0 3px rgba(99,102,241,0.06)" : "none",
                }}
            >
                {/* ── Header row ─────────────────────────────────────────────────── */}
                <div className="flex items-center gap-3 px-4 py-3.5">

                    {/* Drag handle */}
                    <span
                        {...dragHandleProps}
                        className="shrink-0 cursor-grab active:cursor-grabbing"
                        style={{ color: "var(--color-text-muted)", opacity: 0.5 }}
                        title="Drag to reorder"
                    >
                        <DragIcon />
                    </span>

                    {/* Order number */}
                    <span
                        className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center
                       text-xs font-bold"
                        style={{
                            backgroundColor: "rgba(99,102,241,0.1)",
                            color: "var(--color-primary)",
                        }}
                    >
                        {index + 1}
                    </span>

                    {/* Title + meta — click to expand */}
                    <button
                        type="button"
                        onClick={onToggle}
                        className="flex-1 flex items-center gap-3 text-left min-w-0"
                    >
                        <div className="min-w-0">
                            <p className="text-sm font-semibold truncate"
                                style={{ color: "var(--color-text-heading)" }}>
                                {module.title}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                                {lessonCount} lesson{lessonCount !== 1 ? "s" : ""}
                                {module.description && ` · ${module.description.slice(0, 40)}${module.description.length > 40 ? "…" : ""}`}
                            </p>
                        </div>
                    </button>

                    {/* Status badge */}
                    <span
                        className="hidden sm:inline-flex shrink-0 text-xs font-semibold
                       px-2 py-0.5 rounded-full"
                        style={{
                            backgroundColor: module.isPublished
                                ? "rgba(16,185,129,0.1)" : "rgba(148,163,184,0.1)",
                            color: module.isPublished ? "#10b981" : "var(--color-text-muted)",
                        }}
                    >
                        {module.isPublished ? "Published" : "Draft"}
                    </span>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                        {/* Publish toggle */}
                        <ActionBtn
                            title={module.isPublished ? "Unpublish" : "Publish"}
                            onClick={() => onPublish(module._id, module.isPublished)}
                            color={module.isPublished ? "#10b981" : "var(--color-text-muted)"}
                        >
                            <EyeIcon off={module.isPublished} />
                        </ActionBtn>

                        {/* Edit */}
                        <ActionBtn title="Edit module" onClick={() => setEditing(true)}>
                            <EditIcon />
                        </ActionBtn>

                        {/* Delete */}
                        <ActionBtn
                            title="Delete module"
                            onClick={() => setConfirming(true)}
                            hoverColor="var(--color-error)"
                        >
                            <TrashIcon />
                        </ActionBtn>

                        {/* Expand chevron */}
                        <button
                            type="button"
                            onClick={onToggle}
                            className="w-7 h-7 flex items-center justify-center rounded-lg
                         transition-colors duration-150 ml-1"
                            style={{ color: "var(--color-text-muted)" }}
                        >
                            <ChevronIcon open={isOpen} />
                        </button>
                    </div>
                </div>

                {/* ── Inline edit form ────────────────────────────────────────────── */}
                {editing && (
                    <div className="px-4 pb-4 pt-1"
                        style={{ borderTop: "1px solid var(--color-border)" }}>
                        <ModuleForm
                            initial={module}
                            onSubmit={handleUpdate}
                            onCancel={() => setEditing(false)}
                            saving={saving}
                        />
                    </div>
                )}
            </div>

            {/* Delete confirm modal */}
            {confirming && (
                <DeleteConfirm
                    title={module.title}
                    onConfirm={handleDelete}
                    onCancel={() => setConfirming(false)}
                    saving={saving}
                />
            )}
        </>
    );
};

// ── Small icon action button ──────────────────────────────────────────────────
const ActionBtn = ({ children, title, onClick, color, hoverColor }) => (
    <button
        type="button"
        title={title}
        onClick={onClick}
        className="w-7 h-7 flex items-center justify-center rounded-lg
               transition-all duration-150"
        style={{ color: color || "var(--color-text-muted)", border: "1px solid transparent" }}
        onMouseEnter={(e) => {
            e.currentTarget.style.color = hoverColor || color || "var(--color-primary)";
            e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.08)";
            e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)";
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.color = color || "var(--color-text-muted)";
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.borderColor = "transparent";
        }}
    >
        {children}
    </button>
);

export default ModuleCard;