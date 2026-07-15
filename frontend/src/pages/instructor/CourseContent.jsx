import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useModules } from "../../services/useModules.js";
import ModuleAccordion from "../../components/instructor/ModuleAccordian.jsx";
import ModuleForm from "../../components/instructor/ModuleForm.jsx";
import ContentSidebar from "../../components/instructor/ContentSidebar.jsx";

// ── Icons ─────────────────────────────────────────────────────────────────────
const PlusIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const MenuIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

const BackIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
);

// ── Skeleton loaders ──────────────────────────────────────────────────────────
const ModuleSkeleton = () => (
    <div className="rounded-xl h-14 animate-pulse"
        style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }} />
);

// ── Empty state ───────────────────────────────────────────────────────────────
const EmptyModules = ({ onAdd }) => (
    <div
        className="flex flex-col items-center justify-center py-20 text-center
               rounded-2xl"
        style={{
            backgroundColor: "var(--color-bg-card)",
            border: "2px dashed var(--color-border)",
        }}
    >
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5"
            style={{ backgroundColor: "rgba(99,102,241,0.08)" }}>
            🗂️
        </div>
        <h3 className="text-lg font-bold mb-2"
            style={{ color: "var(--color-text-heading)", fontFamily: "var(--font-heading)" }}>
            No modules yet
        </h3>
        <p className="text-sm mb-6 max-w-xs" style={{ color: "var(--color-text-muted)" }}>
            Modules are sections of your course. Add your first module to start
            building your curriculum.
        </p>
        <button
            onClick={onAdd}
            className="btn-primary px-6 py-2.5 text-sm inline-flex items-center gap-2"
            style={{ backgroundColor: "var(--color-primary)" }}
        >
            <PlusIcon /> Add First Module
        </button>
    </div>
);

// ── Inline create module form card ────────────────────────────────────────────
const CreateModuleCard = ({ onSubmit, onCancel, saving }) => (
    <div
        className="rounded-xl p-5"
        style={{
            backgroundColor: "var(--color-bg-card)",
            border: "1px solid rgba(99,102,241,0.4)",
            boxShadow: "0 0 0 3px rgba(99,102,241,0.06)",
        }}
    >
        <p className="text-sm font-semibold mb-4"
            style={{ color: "var(--color-text-heading)", fontFamily: "var(--font-heading)" }}>
            New Module
        </p>
        <ModuleForm onSubmit={onSubmit} onCancel={onCancel} saving={saving} />
    </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const CourseContent = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const {
        modules,
        loading,
        saving,
        error,
        fetchModules,
        createModule,
        updateModule,
        deleteModule,
        togglePublish,
        reorderModules,
        updateModuleLessons,
    } = useModules(courseId);

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [activeLesson, setActiveLesson] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => { fetchModules(); }, [fetchModules]);

    // ── Module create ─────────────────────────────────────────────────────────
    const handleCreateModule = async (data) => {
        const created = await createModule(data);
        if (created) setShowCreateForm(false);
    };

    // ── Lesson sidebar click — scroll to module ───────────────────────────────
    const handleLessonClick = (moduleId, lessonId) => {
        setActiveLesson(lessonId);
        setSidebarOpen(false);
        const el = document.getElementById(`module-${moduleId}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    // ── Reorder: move module up / down ────────────────────────────────────────
    const moveModule = async (index, direction) => {
        const next = [...modules];
        const target = index + direction;
        if (target < 0 || target >= next.length) return;
        [next[index], next[target]] = [next[target], next[index]];
        await reorderModules(next);
    };

    return (
        <div className="min-h-screen py-6 px-4 sm:px-6"
            style={{ backgroundColor: "var(--color-bg)" }}>
            <div className="max-w-6xl mx-auto">

                {/* ── Header ─────────────────────────────────────────────────── */}
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                        {/* Back link */}
                        <button
                            onClick={() => navigate("/instructor/manage-courses")}
                            className="flex items-center gap-1.5 text-sm mb-3 transition-colors duration-150"
                            style={{ color: "var(--color-text-muted)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
                        >
                            <BackIcon /> Back to My Courses
                        </button>

                        <h1
                            className="text-2xl font-bold"
                            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-heading)" }}
                        >
                            Course Content
                        </h1>
                        <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                            Build your curriculum — add modules and lessons in order.
                        </p>
                    </div>

                    {/* Right: actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        {/* Mobile sidebar toggle */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg
                         transition-colors duration-150"
                            style={{
                                backgroundColor: "var(--color-bg-card)",
                                border: "1px solid var(--color-border)",
                                color: "var(--color-text-muted)",
                            }}
                            title="Course outline"
                        >
                            <MenuIcon />
                        </button>

                        {/* Add module */}
                        {!showCreateForm && modules.length > 0 && (
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl"
                                style={{ backgroundColor: "var(--color-primary)" }}
                            >
                                <PlusIcon /> Add Module
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Error banner ────────────────────────────────────────────── */}
                {error && (
                    <div
                        className="mb-4 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
                        style={{
                            backgroundColor: "rgba(248,113,113,0.08)",
                            border: "1px solid rgba(248,113,113,0.25)",
                            color: "var(--color-error)",
                        }}
                    >
                        ⚠️ {error}
                    </div>
                )}

                {/* ── Main layout: accordion + sidebar ────────────────────────── */}
                <div className="flex gap-6 items-start">

                    {/* Left: module list */}
                    <div className="flex-1 min-w-0 space-y-3">

                        {/* Loading */}
                        {loading && (
                            <>
                                <ModuleSkeleton />
                                <ModuleSkeleton />
                                <ModuleSkeleton />
                            </>
                        )}

                        {/* Empty state */}
                        {!loading && modules.length === 0 && !showCreateForm && (
                            <EmptyModules onAdd={() => setShowCreateForm(true)} />
                        )}

                        {/* Module accordions */}
                        {!loading && modules.map((module, index) => (
                            <div key={module._id} id={`module-${module._id}`}>
                                <ModuleAccordion
                                    module={module}
                                    index={index}
                                    defaultOpen={index === 0}
                                    onUpdateModule={updateModule}
                                    onDeleteModule={deleteModule}
                                    onPublishModule={togglePublish}
                                    onLessonsChange={updateModuleLessons}
                                    moduleSaving={saving}
                                    dragHandleProps={{
                                        // simple up/down via keyboard-accessible buttons
                                        // drag-and-drop library can replace this in future
                                        onKeyDown: (e) => {
                                            if (e.key === "ArrowUp") moveModule(index, -1);
                                            if (e.key === "ArrowDown") moveModule(index, 1);
                                        },
                                        tabIndex: 0,
                                        role: "button",
                                        "aria-label": "Drag to reorder module",
                                    }}
                                />
                            </div>
                        ))}

                        {/* Inline create form */}
                        {showCreateForm && (
                            <CreateModuleCard
                                onSubmit={handleCreateModule}
                                onCancel={() => setShowCreateForm(false)}
                                saving={saving}
                            />
                        )}

                        {/* Add another module button (after list) */}
                        {!loading && modules.length > 0 && !showCreateForm && (
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                           text-sm font-medium transition-all duration-150 border border-dashed"
                                style={{
                                    color: "var(--color-text-muted)",
                                    borderColor: "var(--color-border)",
                                    backgroundColor: "transparent",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = "var(--color-primary)";
                                    e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)";
                                    e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.04)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = "var(--color-text-muted)";
                                    e.currentTarget.style.borderColor = "var(--color-border)";
                                    e.currentTarget.style.backgroundColor = "transparent";
                                }}
                            >
                                <PlusIcon /> Add Another Module
                            </button>
                        )}
                    </div>

                    {/* Right: outline sidebar */}
                    <ContentSidebar
                        modules={modules}
                        activeLesson={activeLesson}
                        onLessonClick={handleLessonClick}
                        mobileOpen={sidebarOpen}
                        onMobileClose={() => setSidebarOpen(false)}
                    />
                </div>

            </div>
        </div>
    );
};

export default CourseContent;