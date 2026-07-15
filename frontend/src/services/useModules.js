import { useState, useCallback } from "react";
import { moduleApi } from "../api/content.api.js";
import toast from "react-hot-toast";

export const useModules = (courseId) => {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // ── Helpers ─────────────────────────────────────────────────────────────────
    const handleError = (err) => {
        const msg = err.response?.data?.message || "Something went wrong";
        setError(msg);
        toast.error(msg);
    };

    // ── Fetch all modules (with nested lessons) ──────────────────────────────────
    const fetchModules = useCallback(async () => {
        if (!courseId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await moduleApi.getAll(courseId);
            setModules(res.data.data.modules || []);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    // ── Create module ────────────────────────────────────────────────────────────
    const createModule = useCallback(async (data) => {
        setSaving(true);
        try {
            const res = await moduleApi.create(courseId, data);
            const newModule = { ...res.data.data.module, lessons: [] };
            setModules((prev) => [...prev, newModule]);
            toast.success("Module created");
            return newModule;
        } catch (err) {
            handleError(err);
            return null;
        } finally {
            setSaving(false);
        }
    }, [courseId]);

    // ── Update module ────────────────────────────────────────────────────────────
    const updateModule = useCallback(async (moduleId, data) => {
        setSaving(true);
        try {
            const res = await moduleApi.update(courseId, moduleId, data);
            const updated = res.data.data.module;
            setModules((prev) =>
                prev.map((m) => m._id === moduleId ? { ...m, ...updated } : m)
            );
            toast.success("Module updated");
            return updated;
        } catch (err) {
            handleError(err);
            return null;
        } finally {
            setSaving(false);
        }
    }, [courseId]);

    // ── Delete module ────────────────────────────────────────────────────────────
    const deleteModule = useCallback(async (moduleId) => {
        setSaving(true);
        try {
            await moduleApi.delete(courseId, moduleId);
            setModules((prev) => prev.filter((m) => m._id !== moduleId));
            toast.success("Module deleted");
            return true;
        } catch (err) {
            handleError(err);
            return false;
        } finally {
            setSaving(false);
        }
    }, [courseId]);

    // ── Toggle publish ───────────────────────────────────────────────────────────
    const togglePublish = useCallback(async (moduleId, currentState) => {
        try {
            await moduleApi.update(courseId, moduleId, { isPublished: !currentState });
            setModules((prev) =>
                prev.map((m) =>
                    m._id === moduleId ? { ...m, isPublished: !currentState } : m
                )
            );
            toast.success(`Module ${!currentState ? "published" : "unpublished"}`);
        } catch (err) {
            handleError(err);
        }
    }, [courseId]);

    // ── Reorder (optimistic update) ──────────────────────────────────────────────
    const reorderModules = useCallback(async (reordered) => {
        const prev = modules;
        setModules(reordered); // optimistic
        try {
            await moduleApi.reorder(courseId, reordered.map((m) => m._id));
        } catch (err) {
            setModules(prev); // rollback
            handleError(err);
        }
    }, [courseId, modules]);

    // ── Update lesson list inside a module (called from useLessons) ──────────────
    const updateModuleLessons = useCallback((moduleId, lessons) => {
        setModules((prev) =>
            prev.map((m) => m._id === moduleId ? { ...m, lessons } : m)
        );
    }, []);

    return {
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
    };
};