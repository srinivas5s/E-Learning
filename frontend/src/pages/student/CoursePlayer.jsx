import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { useCoursePlayer } from "../../services/useCoursePlayer.js";
import LessonSidebar from "../../components/student/LessonSidebar.jsx";
import VideoPlayer from "../../components/student/VideoPlayer.jsx";
import LessonContent from "../../components/student/LessonContent.jsx";
import Attachments from "../../components/student/Attachments.jsx";
import LessonNavigation from "../../components/student/LessonNavigation.jsx";

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
    const [searchParams, setSearchParams] = useSearchParams();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
    } = useCoursePlayer(slug);

    // ── Initial load — restore lesson from URL if present ────────────────────────
    useEffect(() => {
        const initialLessonId = searchParams.get("lesson");
        fetchCourseAndModules(initialLessonId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);

    // ── Keep URL in sync with active lesson ──────────────────────────────────────
    useEffect(() => {
        if (activeLesson?._id) {
            setSearchParams({ lesson: activeLesson._id }, { replace: true });
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeLesson?._id]);

    const handleLessonClick = (moduleId, lessonId) => {
        selectLesson(moduleId, lessonId);
        setMobileSidebarOpen(false);
    };

    const currentIndex = flatLessons.findIndex((l) => l._id === activeLesson?._id);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex >= 0 && currentIndex < flatLessons.length - 1;

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

            {/* Mobile header — course title + sidebar toggle */}
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

            <div className="flex gap-6 items-start">
                {/* Main content */}
                <div className="flex-1 min-w-0 space-y-4">
                    <VideoPlayer lesson={activeLesson} loading={lessonLoading} />
                    <LessonContent lesson={activeLesson} loading={lessonLoading} />
                    <Attachments attachments={activeLesson?.attachments || []} />
                    <LessonNavigation
                        hasPrev={hasPrev}
                        hasNext={hasNext}
                        onPrev={goToPrev}
                        onNext={goToNext}
                        prevTitle={hasPrev ? flatLessons[currentIndex - 1]?.title : null}
                        nextTitle={hasNext ? flatLessons[currentIndex + 1]?.title : null}
                    />
                </div>

                {/* Sidebar */}
                <LessonSidebar
                    course={course}
                    modules={modules}
                    activeLessonId={activeLesson?._id}
                    onLessonClick={handleLessonClick}
                    mobileOpen={mobileSidebarOpen}
                    onMobileClose={() => setMobileSidebarOpen(false)}
                />
            </div>
        </div>
    );
};

export default CoursePlayer;