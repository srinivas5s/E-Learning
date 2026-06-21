import { useState, useCallback } from "react";
import courseApi from "../../../api/course.api.js";
import toast from "react-hot-toast";

/**
 * Generic async handler — wraps any courseApi call with
 * loading state + toast error handling.
 */
const useAsync = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const run = useCallback(async (fn) => {
        setLoading(true);
        setError(null);
        try {
            const result = await fn();
            return result;
        } catch (err) {
            const message = err.response?.data?.message || "Something went wrong";
            setError(message);
            toast.error(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, error, run };
};

// ── Public hooks ──────────────────────────────────────────────────────────────

/**
 * Fetch paginated/filtered public courses.
 * Returns { courses, pagination } or null on error.
 */
export const useGetAllCourses = () => {
    const { loading, error, run } = useAsync();
    const [data, setData] = useState(null);

    const fetch = useCallback(async (params) => {
        const res = await run(() => courseApi.getAllCourses(params));
        if (res) setData(res.data.data);
    }, [run]);

    return { data, loading, error, fetch };
};

/**
 * Fetch a single published course by slug.
 * Returns course object or null.
 */
export const useGetCourseBySlug = () => {
    const { loading, error, run } = useAsync();
    const [course, setCourse] = useState(null);

    const fetch = useCallback(async (slug) => {
        const res = await run(() => courseApi.getCourseBySlug(slug));
        if (res) setCourse(res.data.data.course);
    }, [run]);

    return { course, loading, error, fetch };
};

// ── Instructor hooks ──────────────────────────────────────────────────────────

/**
 * Fetch instructor's own courses (all statuses).
 */
export const useGetInstructorCourses = () => {
    const { loading, error, run } = useAsync();
    const [data, setData] = useState(null);

    const fetch = useCallback(async (params) => {
        const res = await run(() => courseApi.getInstructorCourses(params));
        if (res) setData(res.data.data);
    }, [run]);

    return { data, loading, error, fetch };
};

/**
 * Fetch a single course by ID (for edit form).
 */
export const useGetCourseById = () => {
    const { loading, error, run } = useAsync();
    const [course, setCourse] = useState(null);

    const fetch = useCallback(async (id) => {
        const res = await run(() => courseApi.getCourseById(id));
        if (res) setCourse(res.data.data.course);
    }, [run]);

    return { course, loading, error, fetch };
};

/**
 * Create a new course.
 * Returns created course or null.
 */
export const useCreateCourse = () => {
    const { loading, error, run } = useAsync();

    const create = useCallback(async (data) => {
        const res = await run(() => courseApi.createCourse(data));
        if (res) {
            toast.success("Course created successfully");
            return res.data.data.course;
        }
        return null;
    }, [run]);

    return { loading, error, create };
};

/**
 * Update a course.
 * Returns updated course or null.
 */
export const useUpdateCourse = () => {
    const { loading, error, run } = useAsync();

    const update = useCallback(async (id, data) => {
        const res = await run(() => courseApi.updateCourse(id, data));
        if (res) {
            toast.success("Course updated successfully");
            return res.data.data.course;
        }
        return null;
    }, [run]);

    return { loading, error, update };
};

/**
 * Toggle publish status of a course.
 * Returns updated course or null.
 */
export const useTogglePublish = () => {
    const { loading, error, run } = useAsync();

    const toggle = useCallback(async (id) => {
        const res = await run(() => courseApi.togglePublish(id));
        if (res) {
            toast.success(res.data.message);
            return res.data.data.course;
        }
        return null;
    }, [run]);

    return { loading, error, toggle };
};

/**
 * Delete a course.
 * Returns true on success, null on error.
 */
export const useDeleteCourse = () => {
    const { loading, error, run } = useAsync();

    const remove = useCallback(async (id) => {
        const res = await run(() => courseApi.deleteCourse(id));
        if (res !== null) {
            toast.success("Course deleted successfully");
            return true;
        }
        return null;
    }, [run]);

    return { loading, error, remove };
};