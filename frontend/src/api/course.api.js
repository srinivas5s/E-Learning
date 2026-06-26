import api from "./axios";

const courseApi = {

  // ── Public ──────────────────────────────────────────────────────────────────

  /**
   * GET /courses
   * Params: search, category, level, language, minPrice, maxPrice,
   *         sort, page, limit
   */
  getAllCourses: (params = {}) =>
    api.get("/courses", { params }),

  /**
   * GET /courses/:slug
   */
  getCourseBySlug: (slug) =>
    api.get(`/courses/${slug}`),

  // ── Instructor ──────────────────────────────────────────────────────────────

  /**
   * GET /courses/instructor/my-courses
   * Params: status, page, limit
   */
  getInstructorCourses: (params = {}) =>
    api.get("/courses/instructor/my-courses", { params }),

  /**
   * GET /courses/instructor/:id
   * Used to pre-fill the edit form
   */
  getCourseById: (id) =>
    api.get(`/courses/instructor/${id}`),

  /**
   * POST /courses
   */
  createCourse: (data) =>
    api.post("/courses", data),

  /**
   * PATCH /courses/:id
   */
  updateCourse: (id, data) =>
    api.patch(`/courses/${id}`, data),

  /**
   * PATCH /courses/:id/publish
   * Toggles draft ↔ published
   */
  togglePublish: (id) =>
    api.patch(`/courses/${id}/publish`),

  /**
   * DELETE /courses/:id
   */
  deleteCourse: (id) =>
    api.delete(`/courses/${id}`),
};

export default courseApi;