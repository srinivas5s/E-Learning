import catchAsync from "../utils/catchAsync.js";
import * as courseService from "../services/course.service.js";

// ── Instructor: Create course ─────────────────────────────────────────────────
export const createCourse = catchAsync(async (req, res) => {
  const course = await courseService.createCourse(req.user._id, req.body);

  res.status(201).json({
    status:  "success",
    message: "Course created successfully",
    data:    { course },
  });
});

// ── Instructor: Get own courses ───────────────────────────────────────────────
export const getInstructorCourses = catchAsync(async (req, res) => {
  const result = await courseService.getInstructorCourses(req.user._id, req.query);

  res.status(200).json({
    status: "success",
    data:   result,
  });
});

// ── Instructor: Get single course by ID (for edit form) ───────────────────────
export const getCourseById = catchAsync(async (req, res) => {
  const course = await courseService.getCourseById(req.params.id, req.user);

  res.status(200).json({
    status: "success",
    data:   { course },
  });
});

// ── Instructor: Update course ─────────────────────────────────────────────────
export const updateCourse = catchAsync(async (req, res) => {
  const course = await courseService.updateCourse(
    req.params.id,
    req.user,
    req.body
  );

  res.status(200).json({
    status:  "success",
    message: "Course updated successfully",
    data:    { course },
  });
});

// ── Instructor: Publish / Unpublish ──────────────────────────────────────────
export const togglePublish = catchAsync(async (req, res) => {
  const course = await courseService.togglePublish(req.params.id, req.user);

  res.status(200).json({
    status:  "success",
    message: `Course ${course.isPublished ? "published" : "unpublished"} successfully`,
    data:    { course },
  });
});

// ── Instructor: Delete course ─────────────────────────────────────────────────
export const deleteCourse = catchAsync(async (req, res) => {
  await courseService.deleteCourse(req.params.id, req.user);

  res.status(200).json({
    status:  "success",
    message: "Course deleted successfully",
    data:    null,
  });
});

// ── Public: Get all published courses ────────────────────────────────────────
export const getAllCourses = catchAsync(async (req, res) => {
  const result = await courseService.getAllCourses(req.query);

  res.status(200).json({
    status: "success",
    data:   result,
  });
});

// ── Public: Get single course by slug ────────────────────────────────────────
export const getCourseBySlug = catchAsync(async (req, res) => {
  const course = await courseService.getCourseBySlug(req.params.slug);

  res.status(200).json({
    status: "success",
    data:   { course },
  });
});