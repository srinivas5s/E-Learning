import api from "./axios.js";

const enrollmentApi = {
    getMyEnrollments: () => api.get("/enrollments/my"),
    getEnrollmentByCourse: (courseId) => api.get(`/enrollments/${courseId}`),
    enroll: (courseId) => api.post("/enrollments", { courseId }),
    cancel: (courseId) => api.delete(`/enrollments/${courseId}`),

    markLessonComplete: (courseId, lessonId) => api.patch(`/enrollments/${courseId}/lessons/${lessonId}/complete`),
    removeCompletedLesson: (courseId, lessonId) => api.delete(`/enrollments/${courseId}/lessons/${lessonId}/complete`),
    updateCurrentLesson: (courseId, lessonId) => api.patch(`/enrollments/${courseId}/current-lesson`, { lessonId }),
    getResumePoint: (courseId) => api.get(`/enrollments/${courseId}/resume`),
};

export default enrollmentApi;