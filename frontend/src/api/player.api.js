import api from "./axios.js";

// ── Player API ────────────────────────────────────────────────────────────────

export const playerApi = {
    getModules: (courseId) => api.get(`/courses/${courseId}/modules`),
    getLesson: (moduleId, lessonId) => api.get(`/modules/${moduleId}/lessons/${lessonId}`),
};