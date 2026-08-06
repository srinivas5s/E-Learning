import { useState, useCallback } from "react";
import { playerApi } from "../api/player.api.js";
import courseApi from "../api/course.api.js";
import enrollmentApi from "../api/enrollment.api.js"; // adjust path to actual location

import toast from "react-hot-toast";

export const useCoursePlayer = (slug) => {
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [activeLesson, setActiveLesson] = useState(null);
    const [activeModuleId, setActiveModuleId] = useState(null);

    const [loading, setLoading] = useState(false);
    const [lessonLoading, setLessonLoading] = useState(false);
    const [error, setError] = useState(null);
    const [enrollment, setEnrollment] = useState(null);
    const [enrollmentLoading, setEnrollmentLoading] = useState(false);

    // ── Helpers ─────────────────────────────────────────────────────────────────
    const handleError = (err) => {
        const msg = err.response?.data?.message || "Something went wrong";
        setError(msg);
        toast.error(msg);
    };

    // ── Fetch enrollment (progress + completion state) ────────────────────────────
    const fetchEnrollment = useCallback(async (courseId) => {
        setEnrollmentLoading(true);
        try {
            const res = await enrollmentApi.getEnrollmentByCourse(courseId);
            setEnrollment(res.data.data.enrollment);
        } catch (err) {
            // Not enrolled, or not applicable in this context — fail silently.
            // CoursePlayer decides whether calling this was appropriate at all.
            setEnrollment(null);
        } finally {
            setEnrollmentLoading(false);
        }
    }, []);

    // ── Mark lesson complete (optimistic) ─────────────────────────────────────────
    const markComplete = useCallback(async (courseId, lessonId) => {
        if (!enrollment) return null;

        const prevEnrollment = enrollment;
        const alreadyDone = enrollment.completedLessons.some((id) => id === lessonId || id?._id === lessonId);
        if (alreadyDone) return enrollment;

        // Optimistic update
        setEnrollment((prev) => ({
            ...prev,
            completedLessons: [...prev.completedLessons, lessonId],
        }));

        try {
            const res = await enrollmentApi.markLessonComplete(courseId, lessonId);
            const updated = res.data.data.enrollment;
            setEnrollment(updated);
            return updated;
        } catch (err) {
            setEnrollment(prevEnrollment); // rollback
            toast.error(err.response?.data?.message || "Failed to mark lesson complete");
            return null;
        }
    }, [enrollment]);

    // ── Unmark lesson complete (optimistic) ────────────────────────────────────────
    const unmarkComplete = useCallback(async (courseId, lessonId) => {
        if (!enrollment) return null;

        const prevEnrollment = enrollment;

        setEnrollment((prev) => ({
            ...prev,
            completedLessons: prev.completedLessons.filter(
                (id) => id !== lessonId && id?._id !== lessonId
            ),
        }));

        try {
            const res = await enrollmentApi.removeCompletedLesson(courseId, lessonId);
            const updated = res.data.data.enrollment;
            setEnrollment(updated);
            return updated;
        } catch (err) {
            setEnrollment(prevEnrollment); // rollback
            toast.error(err.response?.data?.message || "Failed to update lesson");
            return null;
        }
    }, [enrollment]);

    // ── Update current lesson — skips the call if the lesson hasn't actually changed
    const updateCurrentLesson = useCallback(async (courseId, lessonId) => {
        setEnrollment((prev) => {
            if (!prev) return prev;

            const currentId = prev.currentLesson?._id || prev.currentLesson;
            if (currentId === lessonId) return prev; // no-op, same lesson — skip API call

            // Fire-and-forget — don't block player navigation on this write
            enrollmentApi.updateCurrentLesson(courseId, lessonId).catch(() => {
                // Silent — this is a non-critical background sync; a failed write
                // here shouldn't interrupt playback or surface an error toast
            });

            return { ...prev, currentLesson: lessonId };
        });
    }, []);

    // ── Resume learning — returns { lessonId } for CoursePlayer to act on ────────
    const resumeLearning = useCallback(async (courseId) => {
        try {
            const res = await enrollmentApi.getResumePoint(courseId);
            return res.data.data; // { lessonId }
        } catch (err) {
            toast.error(err.response?.data?.message || "Couldn't resume this course");
            return null;
        }
    }, []);
    // ── Flatten modules → single lesson array (adds moduleId/moduleTitle) ────────
    const flattenLessons = (mods) =>
        mods.flatMap((m) =>
            (m.lessons || []).map((l) => ({
                ...l,
                moduleId: m._id,
                moduleTitle: m.title,
            }))
        );

    // ── Fetch course (by slug) + its modules/lessons ──────────────────────────────
    const fetchCourseAndModules = useCallback(async (initialLessonId) => {
        setLoading(true);
        setError(null);
        try {
            const courseRes = await courseApi.getCourseBySlug(slug);
            const courseData = courseRes.data.data.course;
            setCourse(courseData);

            const modulesRes = await playerApi.getModules(courseData._id);
            const modulesData = modulesRes.data.data.modules || [];
            setModules(modulesData);

            const flat = flattenLessons(modulesData);
            const target = initialLessonId
                ? flat.find((l) => l._id === initialLessonId)
                : flat[0];

            if (target) {
                await selectLesson(target.moduleId, target._id);
            }
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);

    // ── Select a lesson (fetches full detail: video, attachments) ────────────────
    const selectLesson = useCallback(async (moduleId, lessonId) => {
        setLessonLoading(true);
        try {
            const res = await playerApi.getLesson(moduleId, lessonId);
            setActiveLesson(res.data.data.lesson);
            setActiveModuleId(moduleId);
        } catch (err) {
            handleError(err);
        } finally {
            setLessonLoading(false);
        }
    }, []);

    // ── Prev / Next navigation across the flattened lesson list ──────────────────
    const flatLessons = flattenLessons(modules);

    const goToLesson = useCallback((direction) => {
        if (!activeLesson || flatLessons.length === 0) return;
        const idx = flatLessons.findIndex((l) => l._id === activeLesson._id);
        const nextIdx = direction === "next" ? idx + 1 : idx - 1;
        const target = flatLessons[nextIdx];
        if (target) selectLesson(target.moduleId, target._id);
    }, [activeLesson, flatLessons, selectLesson]);

    return {
        course,
        modules,
        flatLessons,
        activeLesson,
        activeModuleId,
        loading,
        lessonLoading,
        error,
        enrollment,
        enrollmentLoading,
        fetchEnrollment,
        markComplete,
        unmarkComplete,
        updateCurrentLesson,
        resumeLearning,
        fetchCourseAndModules,
        selectLesson,
        goToNext: () => goToLesson("next"),
        goToPrev: () => goToLesson("prev"),
    };
};