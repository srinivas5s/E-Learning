import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import courseApi from "../../api/course.api.js";
import CourseForm from "../../components/instructor/CourseForm.jsx";

// ── Icons ─────────────────────────────────────────────────────────────────────
const BackIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
);

// ── Skeleton ──────────────────────────────────────────────────────────────────
const Skeleton = () => (
    <div className="space-y-6 animate-pulse">
        {[200, 160, 120, 100, 180].map((h, i) => (
            <div key={i} className="rounded-2xl p-8"
                style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
                <div className="h-4 rounded w-1/4 mb-6" style={{ backgroundColor: "var(--color-border)" }} />
                <div className="space-y-3">
                    <div className="h-10 rounded" style={{ backgroundColor: "var(--color-border)", height: `${h / 4}px` }} />
                    <div className="h-8 rounded w-3/4" style={{ backgroundColor: "var(--color-border)" }} />
                </div>
            </div>
        ))}
    </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const EditCourse = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [fetching, setFetching] = useState(true);
    const [saving, setSaving] = useState(false);
    const [fetchErr, setFetchErr] = useState(null);

    // Fetch course on mount
    useEffect(() => {
        courseApi.getCourseById(courseId)
            .then((res) => setCourse(res.data.data.course))
            .catch((err) => setFetchErr(err.response?.data?.message || "Failed to load course"))
            .finally(() => setFetching(false));
    }, [courseId]);

    const goToManageCourses = () => navigate("/instructor/manage-courses");

    const handleSubmit = async (formData) => {
        setSaving(true);
        try {
            await courseApi.updateCourse(courseId, formData);
            toast.success("Course updated successfully");
            goToManageCourses();
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to update course";
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6"
            style={{ backgroundColor: "var(--color-bg)" }}>
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={goToManageCourses}
                        className="flex items-center gap-1.5 text-sm mb-4 transition-colors duration-150"
                        style={{ color: "var(--color-text-muted)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
                    >
                        <BackIcon /> Back to Manage Courses
                    </button>

                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-1.5 text-xs mb-4 flex-wrap"
                        style={{ color: "var(--color-text-muted)" }}>
                        <button onClick={() => navigate("/instructor/dashboard")}
                            className="hover:underline transition-colors duration-150"
                            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}>
                            Dashboard
                        </button>
                        <span>/</span>
                        <button onClick={goToManageCourses}
                            className="hover:underline transition-colors duration-150"
                            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}>
                            Manage Courses
                        </button>
                        <span>/</span>
                        <span style={{ color: "var(--color-text)" }}>
                            {course ? course.title : "Edit Course"}
                        </span>
                    </nav>

                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold"
                                style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-heading)" }}>
                                Edit Course
                            </h1>
                            {course && (
                                <p className="text-sm mt-1 truncate max-w-md"
                                    style={{ color: "var(--color-text-muted)" }}>
                                    {course.title}
                                </p>
                            )}
                        </div>

                        {/* Status badge */}
                        {course && (
                            <span
                                className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full"
                                style={{
                                    backgroundColor: course.isPublished
                                        ? "rgba(16,185,129,0.1)" : "rgba(148,163,184,0.1)",
                                    color: course.isPublished ? "#10b981" : "var(--color-text-muted)",
                                    border: `1px solid ${course.isPublished ? "rgba(16,185,129,0.2)" : "var(--color-border)"}`,
                                }}
                            >
                                {course.isPublished ? "● Published" : "● Draft"}
                            </span>
                        )}
                    </div>
                </div>

                {/* States */}
                {fetching && <Skeleton />}

                {fetchErr && (
                    <div className="px-4 py-4 rounded-xl text-sm flex items-center gap-2"
                        style={{
                            backgroundColor: "rgba(248,113,113,0.08)",
                            border: "1px solid rgba(248,113,113,0.2)",
                            color: "var(--color-error)",
                        }}>
                        <span>⚠️</span>
                        <div>
                            <p className="font-medium">Failed to load course</p>
                            <p className="text-xs mt-0.5 opacity-80">{fetchErr}</p>
                        </div>
                    </div>
                )}

                {!fetching && course && (
                    <CourseForm
                        initial={course}
                        isEdit
                        onSubmit={handleSubmit}
                        onCancel={goToManageCourses}
                        saving={saving}
                    />
                )}

            </div>
        </div>
    );
};

export default EditCourse;