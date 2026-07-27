import { useState, useCallback } from "react";
import { playerApi } from "../api/player.api.js";
import courseApi from "../api/course.api.js";
import toast from "react-hot-toast";

export const useCoursePlayer = (slug) => {
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [activeLesson, setActiveLesson] = useState(null);
    const [activeModuleId, setActiveModuleId] = useState(null);

    const [loading, setLoading] = useState(false);
    const [lessonLoading, setLessonLoading] = useState(false);
    const [error, setError] = useState(null);

    // ── Helpers ─────────────────────────────────────────────────────────────────
    const handleError = (err) => {
        const msg = err.response?.data?.message || "Something went wrong";
        setError(msg);
        toast.error(msg);
    };

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
        fetchCourseAndModules,
        selectLesson,
        goToNext: () => goToLesson("next"),
        goToPrev: () => goToLesson("prev"),
    };
};