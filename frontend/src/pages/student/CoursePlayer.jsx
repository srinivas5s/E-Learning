import { useEffect, useState } from "react";
import { useParams, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCoursePlayer } from "../../services/useCoursePlayer.js";
import LessonSidebar from "../../components/student/LessonSidebar.jsx";
import VideoPlayer from "../../components/student/VideoPlayer.jsx";
import LessonContent from "../../components/student/LessonContent.jsx";
import Attachments from "../../components/student/Attachments.jsx";
import LessonNavigation from "../../components/student/LessonNavigation.jsx";
import toast from "react-hot-toast";

const MenuIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

const CoursePlayer = () => {
    const { slug } = useParams();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [accessChecked, setAccessChecked] = useState(false);
    const [accessDenied, setAccessDenied] = useState(false);

    // ── Mode detection from route ─────────────────────────────────────────────
    const mode = location.pathname.endsWith("/preview") ? "preview" : "learn";
    const isPreviewMode = mode === "preview";

    const {
        course,
        modules,
        flatLessons,
        activeLesson,
        activeModuleId,
        loading,
        lessonLoading,
        error,
        fetchCourseAndModules,
        selectLesson,
        goToNext,
        goToPrev,
        enrollment,
        fetchEnrollment,
        markComplete,
        unmarkComplete,
        updateCurrentLesson,
    } = useCoursePlayer(slug);

    // ── Initial load — in preview mode, restore/land on a preview-eligible lesson only
    useEffect(() => {
        const requestedLessonId = searchParams.get("lesson");
        fetchCourseAndModules(requestedLessonId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug, mode]);

    // Once modules load in preview mode, if the active/restored lesson isn't
    // actually a preview lesson, redirect selection to the first available one
    useEffect(() => {
        if (!isPreviewMode || flatLessons.length === 0) return;
        if (activeLesson && activeLesson.isPreview) return;

        const firstPreview = flatLessons.find((l) => l.isPreview);
        if (firstPreview) {
            selectLesson(firstPreview.moduleId, firstPreview._id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPreviewMode, flatLessons, activeLesson?._id]);

    useEffect(() => {
        if (!isPreviewMode && course?._id) {
            fetchEnrollment(course._id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPreviewMode, course?._id]);

    useEffect(() => {
        if (activeLesson?._id) {
            setSearchParams({ lesson: activeLesson._id }, { replace: true });
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
        if (!isPreviewMode && course?._id) {
            updateCurrentLesson(course._id, activeLesson._id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeLesson?._id]);

    useEffect(() => {
        if (isPreviewMode) {
            setAccessChecked(true); // preview mode has its own lock logic already; no course-level gate needed
            return;
        }
        if (!course || !user) return; // wait for course + auth to be ready

        const isAdmin = user.role === "admin";
        const isOwnerInstructor =
            user.role === "instructor" && course.instructor?._id === user._id;
        const isEnrolled = !!enrollment; // from useCoursePlayer's fetchEnrollment, called separately

        if (isAdmin || isOwnerInstructor || isEnrolled) {
            setAccessChecked(true);
            return;
        }

        // Denied — student not enrolled, or instructor who doesn't own this course
        toast.error("You need to enroll in this course to access the lessons");
        navigate(`/courses/${slug}`, { replace: true });
        setAccessDenied(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPreviewMode, course, user, enrollment]);

    // ── Gate lesson selection — blocks locked lessons in preview mode ────────────
    const handleLessonClick = (moduleId, lessonId) => {
        if (isPreviewMode) {
            const target = flatLessons.find((l) => l._id === lessonId);
            if (!target?.isPreview) return; // locked — ignore the click
        }
        selectLesson(moduleId, lessonId);
        setMobileSidebarOpen(false);
    };

    // ── Prev/Next also respect the lock in preview mode ──────────────────────────
    const currentIndex = flatLessons.findIndex((l) => l._id === activeLesson?._id);

    const handleNext = () => {
        if (!isPreviewMode) return goToNext();
        const next = flatLessons.slice(currentIndex + 1).find((l) => l.isPreview);
        if (next) selectLesson(next.moduleId, next._id);
    };

    const handleToggleComplete = () => {
        if (!activeLesson || !course?._id) return;
        const isDone = enrollment?.completedLessons?.some(
            (id) => id === activeLesson._id || id?._id === activeLesson._id
        );
        if (isDone) {
            unmarkComplete(course._id, activeLesson._id);
        } else {
            markComplete(course._id, activeLesson._id);
        }
    };

    const handlePrev = () => {
        if (!isPreviewMode) return goToPrev();
        const prevSlice = flatLessons.slice(0, currentIndex).reverse();
        const prev = prevSlice.find((l) => l.isPreview);
        if (prev) selectLesson(prev.moduleId, prev._id);
    };

    const hasNext = isPreviewMode
        ? flatLessons.slice(currentIndex + 1).some((l) => l.isPreview)
        : currentIndex >= 0 && currentIndex < flatLessons.length - 1;

    const hasPrev = isPreviewMode
        ? flatLessons.slice(0, currentIndex).some((l) => l.isPreview)
        : currentIndex > 0;

    const isLessonBlocked = isPreviewMode && activeLesson && !activeLesson.isPreview;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <span
                    className="w-8 h-8 border-2 rounded-full animate-spin"
                    style={{ borderColor: "var(--color-border)", borderTopColor: "var(--color-primary)" }}
                />
            </div>
        );
    }

    if (error && !course) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                    Couldn't load this course
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-350 mx-auto px-4 py-6">

            <div className="lg:hidden flex items-center justify-between mb-4">
                <h1 className="text-sm font-bold truncate" style={{ color: "var(--color-text-heading)" }}>
                    {course?.title}
                </h1>
                <button
                    type="button"
                    onClick={() => setMobileSidebarOpen(true)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg shrink-0"
                    style={{ border: "1px solid var(--color-border)", color: "var(--color-text)" }}
                >
                    <MenuIcon />
                </button>
            </div>

            {!isPreviewMode && enrollment && (
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-border)" }}>
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${enrollment.progressPercent}%`,
                                backgroundColor: enrollment.progressPercent === 100 ? "#10b981" : "var(--color-primary)",
                            }}
                        />
                    </div>
                    <span className="text-xs font-semibold shrink-0" style={{ color: "var(--color-text-muted)" }}>
                        {enrollment.progressPercent}% complete
                    </span>
                </div>
            )}

            <div className="flex gap-6 items-start">
                <div className="flex-1 min-w-0 space-y-4">
                    {isLessonBlocked ? (
                        <div
                            className="rounded-xl p-10 flex flex-col items-center justify-center gap-3 text-center"
                            style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
                        >
                            <span className="text-3xl">🔒</span>
                            <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                                This lesson isn't available in preview
                            </p>
                            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                                Enroll to unlock the full course
                            </p>
                        </div>
                    ) : (
                        <>
                            <VideoPlayer lesson={activeLesson} loading={lessonLoading} />
                            <LessonContent lesson={activeLesson} loading={lessonLoading} />
                            {!isPreviewMode && activeLesson && (
                                <button
                                    type="button"
                                    onClick={handleToggleComplete}
                                    className="w-full py-2.5 text-sm font-semibold rounded-xl transition-colors duration-150"
                                    style={
                                        enrollment?.completedLessons?.some(
                                            (id) => id === activeLesson._id || id?._id === activeLesson._id
                                        )
                                            ? { backgroundColor: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }
                                            : { backgroundColor: "var(--color-primary)", color: "#fff" }
                                    }
                                >
                                    {enrollment?.completedLessons?.some(
                                        (id) => id === activeLesson._id || id?._id === activeLesson._id
                                    )
                                        ? "✓ Completed"
                                        : "Mark as Complete"}
                                </button>
                            )}
                            <Attachments attachments={activeLesson?.attachments || []} />
                        </>
                    )}
                    <LessonNavigation
                        hasPrev={hasPrev}
                        hasNext={hasNext}
                        onPrev={handlePrev}
                        onNext={handleNext}
                        prevTitle={hasPrev ? flatLessons[currentIndex - 1]?.title : null}
                        nextTitle={hasNext ? flatLessons[currentIndex + 1]?.title : null}
                    />
                </div>

                <LessonSidebar
                    course={course}
                    modules={modules}
                    activeLessonId={activeLesson?._id}
                    onLessonClick={handleLessonClick}
                    mobileOpen={mobileSidebarOpen}
                    onMobileClose={() => setMobileSidebarOpen(false)}
                    isPreviewMode={isPreviewMode}
                    completedLessons={enrollment?.completedLessons || []}
                />
            </div>
        </div>
    );
};

export default CoursePlayer;