import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { lessonApi } from "../../api/content.api.js";
import { useLessons } from "../../services/useLessons.js";
import LessonForm from "../../components/instructor/LessonForm.jsx";

const BackIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
);

// ── Skeleton ──────────────────────────────────────────────────────────────────
const Skeleton = () => (
    <div className="space-y-5 animate-pulse">
        {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl p-5"
                style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
                <div className="h-4 rounded w-1/4 mb-4" style={{ backgroundColor: "var(--color-border)" }} />
                <div className="h-10 rounded mb-3" style={{ backgroundColor: "var(--color-border)" }} />
                <div className="h-20 rounded" style={{ backgroundColor: "var(--color-border)" }} />
            </div>
        ))}
    </div>
);

const EditLesson = () => {
    const { courseId, moduleId, lessonId } = useParams();
    const navigate = useNavigate();

    const [lesson, setLesson] = useState(null);
    const [fetching, setFetching] = useState(true);
    const [fetchErr, setFetchErr] = useState(null);

    const { saving, updateLesson } = useLessons(moduleId);

    // Fetch lesson on mount
    useEffect(() => {
        lessonApi.getOne(moduleId, lessonId)
            .then((res) => setLesson(res.data.data.lesson))
            .catch((err) => setFetchErr(err.response?.data?.message || "Failed to load lesson"))
            .finally(() => setFetching(false));
    }, [moduleId, lessonId]);

    const handleSubmit = async (data) => {
        const updated = await updateLesson(lessonId, data, []);
        if (updated) navigate(`/instructor/courses/${courseId}/content`);
    };

    const handleCancel = () =>
        navigate(`/instructor/courses/${courseId}/content`);

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6"
            style={{ backgroundColor: "var(--color-bg)" }}>
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={handleCancel}
                        className="flex items-center gap-1.5 text-sm mb-4 transition-colors duration-150"
                        style={{ color: "var(--color-text-muted)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
                    >
                        <BackIcon /> Back to Course Content
                    </button>

                    <h1
                        className="text-2xl font-bold"
                        style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-heading)" }}
                    >
                        Edit Lesson
                    </h1>
                    {lesson && (
                        <p className="text-sm mt-1 truncate" style={{ color: "var(--color-text-muted)" }}>
                            {lesson.title}
                        </p>
                    )}
                </div>

                {/* States */}
                {fetching && <Skeleton />}

                {fetchErr && (
                    <div
                        className="px-4 py-3 rounded-xl text-sm"
                        style={{
                            backgroundColor: "rgba(248,113,113,0.08)",
                            border: "1px solid rgba(248,113,113,0.2)",
                            color: "var(--color-error)",
                        }}
                    >
                        ⚠️ {fetchErr}
                    </div>
                )}

                {!fetching && lesson && (
                    <LessonForm
                        initial={lesson}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        saving={saving}
                    />
                )}
            </div>
        </div>
    );
};

export default EditLesson;