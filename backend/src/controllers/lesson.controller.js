import catchAsync from "../utils/catchAsync.js";
import * as lessonService from "../services/lesson.service.js";

// ── Create lesson ─────────────────────────────────────────────────────────────
export const createLesson = catchAsync(async (req, res) => {
    const lesson = await lessonService.createLesson(
        req.params.moduleId,
        req.user,
        req.body
    );

    res.status(201).json({
        status: "success",
        message: "Lesson created successfully",
        data: { lesson },
    });
});

// ── Get lessons by module ─────────────────────────────────────────────────────
export const getLessonsByModule = catchAsync(async (req, res) => {
    const lessons = await lessonService.getLessonsByModule(
        req.params.moduleId,
        req.user  // may be undefined for public access
    );

    res.status(200).json({
        status: "success",
        data: { lessons, total: lessons.length },
    });
});

// ── Get single lesson ─────────────────────────────────────────────────────────
export const getLessonById = catchAsync(async (req, res) => {
    const lesson = await lessonService.getLessonById(
        req.params.lessonId,
        req.user
    );

    res.status(200).json({
        status: "success",
        data: { lesson },
    });
});

// ── Update lesson ─────────────────────────────────────────────────────────────
export const updateLesson = catchAsync(async (req, res) => {
    const lesson = await lessonService.updateLesson(
        req.params.moduleId,
        req.params.lessonId,
        req.user,
        req.body
    );

    res.status(200).json({
        status: "success",
        message: "Lesson updated successfully",
        data: { lesson },
    });
});

// ── Publish / Unpublish lesson ────────────────────────────────────────────────
export const togglePublishLesson = catchAsync(async (req, res) => {
    const lesson = await lessonService.togglePublishLesson(
        req.params.moduleId,
        req.params.lessonId,
        req.user
    );

    res.status(200).json({
        status: "success",
        message: `Lesson ${lesson.isPublished ? "published" : "unpublished"} successfully`,
        data: { lesson },
    });
});

// ── Delete lesson ─────────────────────────────────────────────────────────────
export const deleteLesson = catchAsync(async (req, res) => {
    await lessonService.deleteLesson(
        req.params.moduleId,
        req.params.lessonId,
        req.user
    );

    res.status(200).json({
        status: "success",
        message: "Lesson deleted successfully",
        data: null,
    });
});

// ── Reorder lessons ───────────────────────────────────────────────────────────
export const reorderLessons = catchAsync(async (req, res) => {
    const lessons = await lessonService.reorderLessons(
        req.params.moduleId,
        req.user,
        req.body.lessons  // array of ordered lesson IDs
    );

    res.status(200).json({
        status: "success",
        message: "Lessons reordered successfully",
        data: { lessons },
    });
});