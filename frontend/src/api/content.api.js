import api from "./axios.js";

// ── Module API ────────────────────────────────────────────────────────────────

export const moduleApi = {
    getAll: (courseId) => api.get(`/courses/${courseId}/modules`),
    create: (courseId, data) => api.post(`/courses/${courseId}/modules`, data),
    update: (courseId, moduleId, data) => api.patch(`/courses/${courseId}/modules/${moduleId}`, data),
    delete: (courseId, moduleId) => api.delete(`/courses/${courseId}/modules/${moduleId}`),
    reorder: (courseId, moduleIds) => api.patch(`/courses/${courseId}/modules/reorder`, { modules: moduleIds }),
};

// ── Lesson API ────────────────────────────────────────────────────────────────

export const lessonApi = {
    getAll: (moduleId) => api.get(`/modules/${moduleId}/lessons`),
    getOne: (moduleId, lessonId) => api.get(`/modules/${moduleId}/lessons/${lessonId}`),
    create: (moduleId, data) => api.post(`/modules/${moduleId}/lessons`, data),
    update: (moduleId, lessonId, data) => api.patch(`/modules/${moduleId}/lessons/${lessonId}`, data),
    togglePublish: (moduleId, lessonId) => api.patch(`/modules/${moduleId}/lessons/${lessonId}/publish`),
    delete: (moduleId, lessonId) => api.delete(`/modules/${moduleId}/lessons/${lessonId}`),
    reorder: (moduleId, lessonIds) => api.patch(`/modules/${moduleId}/lessons/reorder`, { lessons: lessonIds }),
};