import api from "./axios.js";

const enrollmentApi = {
    getMyEnrollments: () => api.get("/enrollments/my"),
    getEnrollmentByCourse: (courseId) => api.get(`/enrollments/${courseId}`),
    enroll: (courseId) => api.post("/enrollments", { courseId }),
    cancel: (courseId) => api.delete(`/enrollments/${courseId}`),
};

export default enrollmentApi;