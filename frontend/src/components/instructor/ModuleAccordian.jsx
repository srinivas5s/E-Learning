import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ModuleCard from "./ModuleCard.jsx";
import LessonCard from "./LessonCard.jsx";
import { useLessons } from "../../services/useLessons.js";

// ── Add lesson button ─────────────────────────────────────────────────────────
const AddLessonBtn = ({ onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm
               font-medium transition-all duration-150 border border-dashed"
        style={{
            color: "var(--color-primary)",
            borderColor: "rgba(99,102,241,0.3)",
            backgroundColor: "transparent",
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.05)";
            e.currentTarget.style.borderColor = "var(--color-primary)";
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)";
        }}
    >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add Lesson
    </button>
);

// ── Empty lessons state ───────────────────────────────────────────────────────
const EmptyLessons = ({ onAdd }) => (
    <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3"
            style={{ backgroundColor: "rgba(99,102,241,0.08)" }}>
            📝
        </div>
        <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
            No lessons yet
        </p>
        <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
            Add your first lesson to this module
        </p>
        <button
            type="button"
            onClick={onAdd}
            className="btn-primary px-4 py-2 text-xs rounded-lg"
            style={{ backgroundColor: "var(--color-primary)" }}
        >
            + Add Lesson
        </button>
    </div>
);

// ── Module Accordion ──────────────────────────────────────────────────────────
const ModuleAccordion = ({
    module,
    index,
    onUpdateModule,
    onDeleteModule,
    onPublishModule,
    onLessonsChange,
    moduleSaving,
    dragHandleProps,
    defaultOpen,
}) => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(defaultOpen || false);

    const lessons = module.lessons || [];

    const {
        saving: lessonSaving,
        deleteLesson,
        togglePublish: toggleLessonPublish,
        reorderLessons,
    } = useLessons(module._id, onLessonsChange);

    // ── Navigation helpers ───────────────────────────────────────────────────────
    const goToCreateLesson = () =>
        navigate(
            `/instructor/courses/${courseId}/modules/${module._id}/lessons/create`
        );

    const goToEditLesson = (lessonId) =>
        navigate(
            `/instructor/courses/${courseId}/modules/${module._id}/lessons/${lessonId}/edit`
        );

    // ── Lesson reorder (move up / move down) ─────────────────────────────────────
    const moveLesson = async (lessonIndex, direction) => {
        const next = [...lessons];
        const target = lessonIndex + direction;
        if (target < 0 || target >= next.length) return;
        [next[lessonIndex], next[target]] = [next[target], next[lessonIndex]];
        await reorderLessons(next, lessons);
    };

    return (
        <div className="space-y-0">

            {/* Module header */}
            <ModuleCard
                module={module}
                index={index}
                isOpen={isOpen}
                onToggle={() => setIsOpen((o) => !o)}
                onUpdate={onUpdateModule}
                onDelete={onDeleteModule}
                onPublish={onPublishModule}
                saving={moduleSaving}
                dragHandleProps={dragHandleProps}
            />

            {/* Lesson panel — slides in when open */}
            {isOpen && (
                <div
                    className="rounded-b-xl overflow-hidden"
                    style={{
                        backgroundColor: "var(--color-bg)",
                        border: "1px solid rgba(99,102,241,0.2)",
                        borderTop: "none",
                    }}
                >
                    <div className="p-3 space-y-2">

                        {lessons.length === 0 ? (
                            <EmptyLessons onAdd={goToCreateLesson} />
                        ) : (
                            <>
                                {lessons.map((lesson, li) => (
                                    <LessonCard
                                        key={lesson._id}
                                        lesson={lesson}
                                        index={li}
                                        total={lessons.length}
                                        saving={lessonSaving}
                                        onEdit={() => goToEditLesson(lesson._id)}
                                        onDelete={() => deleteLesson(lesson._id, lessons)}
                                        onTogglePublish={() => toggleLessonPublish(lesson._id, lessons)}
                                        onMoveUp={() => moveLesson(li, -1)}
                                        onMoveDown={() => moveLesson(li, 1)}
                                    />
                                ))}

                                <div className="pt-1">
                                    <AddLessonBtn onClick={goToCreateLesson} />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModuleAccordion;