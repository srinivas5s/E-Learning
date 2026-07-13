import api from "./axios.js";

const courseApi = {

  // ── Public ──────────────────────────────────────────────────────────────────

  getAllCourses: (params = {}) => api.get("/courses", { params }),
  getCourseBySlug: (slug) => api.get(`/courses/${slug}`),

  // ── Instructor ──────────────────────────────────────────────────────────────

  getInstructorCourses: (params = {}) => api.get("/courses/instructor/my-courses", { params }),
  getCourseById: (id) => api.get(`/courses/instructor/${id}`),
  createCourse: (data) => api.post("/courses", data),
  updateCourse: (id, data) => api.patch(`/courses/${id}`, data),
  togglePublish: (id) => api.patch(`/courses/${id}/publish`),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  
};

export default courseApi;