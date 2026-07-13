import { useState, useCallback } from "react";
import { lessonApi } from "../services/content.api.js";
import toast from "react-hot-toast";

export const useLessons = (moduleId, onLessonsChange) => {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const handleError = (err) => {
        const msg = err.response?.data?.message || "Something went wrong";
        setError(msg);
        toast.error(msg);
    };

    // ── Create lesson ────────────────────────────────────────────────────────────
    const createLesson = useCallback(async (data, currentLessons) => {
        setSaving(true);
        try {
            const res = await lessonApi.create(moduleId, data);
            const newLesson = res.data.data.lesson;
            const updated = [...(currentLessons || []), newLesson];
            onLessonsChange?.(moduleId, updated);
            toast.success("Lesson created");
            return newLesson;
        } catch (err) {
            handleError(err);
            return null;
        } finally {
            setSaving(false);
        }
    }, [moduleId, onLessonsChange]);

    // ── Update lesson ────────────────────────────────────────────────────────────
    const updateLesson = useCallback(async (lessonId, data, currentLessons) => {
        setSaving(true);
        try {
            const res = await lessonApi.update(moduleId, lessonId, data);
            const updated = res.data.data.lesson;
            const next = (currentLessons || []).map((l) =>
                l._id === lessonId ? { ...l, ...updated } : l
            );
            onLessonsChange?.(moduleId, next);
            toast.success("Lesson updated");
            return updated;
        } catch (err) {
            handleError(err);
            return null;
        } finally {
            setSaving(false);
        }
    }, [moduleId, onLessonsChange]);

    // ── Toggle publish ───────────────────────────────────────────────────────────
    const togglePublish = useCallback(async (lessonId, currentLessons) => {
        try {
            const res = await lessonApi.togglePublish(moduleId, lessonId);
            const updated = res.data.data.lesson;
            const next = (currentLessons || []).map((l) =>
                l._id === lessonId ? { ...l, isPublished: updated.isPublished } : l
            );
            onLessonsChange?.(moduleId, next);
            toast.success(`Lesson ${updated.isPublished ? "published" : "unpublished"}`);
        } catch (err) {
            handleError(err);
        }
    }, [moduleId, onLessonsChange]);

    // ── Delete lesson ────────────────────────────────────────────────────────────
    const deleteLesson = useCallback(async (lessonId, currentLessons) => {
        setSaving(true);
        try {
            await lessonApi.delete(moduleId, lessonId);
            const next = (currentLessons || []).filter((l) => l._id !== lessonId);
            onLessonsChange?.(moduleId, next);
            toast.success("Lesson deleted");
            return true;
        } catch (err) {
            handleError(err);
            return false;
        } finally {
            setSaving(false);
        }
    }, [moduleId, onLessonsChange]);

    // ── Reorder lessons (optimistic) ─────────────────────────────────────────────
    const reorderLessons = useCallback(async (reordered, currentLessons) => {
        onLessonsChange?.(moduleId, reordered); // optimistic
        try {
            await lessonApi.reorder(moduleId, reordered.map((l) => l._id));
        } catch (err) {
            onLessonsChange?.(moduleId, currentLessons); // rollback
            handleError(err);
        }
    }, [moduleId, onLessonsChange]);

    return {
        saving,
        error,
        createLesson,
        updateLesson,
        togglePublish,
        deleteLesson,
        reorderLessons,
    };
};