import catchAsync from "../utils/catchAsync.js";
import * as enrollmentService from "../services/enrollment.service.js";

// ── Enroll in a course ────────────────────────────────────────────────────────
export const enrollStudent = catchAsync(async (req, res) => {
    const enrollment = await enrollmentService.enrollStudent(
        req.body.courseId,
        req.user
    );

    res.status(201).json({
        status: "success",
        message: "Enrolled successfully",
        data: { enrollment },
    });
});

// ── Get my enrollments ────────────────────────────────────────────────────────
export const getMyEnrollments = catchAsync(async (req, res) => {
    const enrollments = await enrollmentService.getMyEnrollments(req.user);

    res.status(200).json({
        status: "success",
        data: { enrollments, total: enrollments.length },
    });
});

// ── Get single enrollment by course ──────────────────────────────────────────
export const getEnrollmentByCourse = catchAsync(async (req, res) => {
    const enrollment = await enrollmentService.getEnrollmentByCourse(
        req.params.courseId,
        req.user
    );

    res.status(200).json({
        status: "success",
        data: { enrollment },
    });
});

// ── Cancel enrollment ─────────────────────────────────────────────────────────
export const cancelEnrollment = catchAsync(async (req, res) => {
    const enrollment = await enrollmentService.cancelEnrollment(
        req.params.courseId,
        req.user
    );

    res.status(200).json({
        status: "success",
        message: "Enrollment cancelled successfully",
        data: { enrollment },
    });
});

// ── Mark lesson complete ──────────────────────────────────────────────────────
export const markLessonComplete = catchAsync(async (req, res) => {
    const enrollment = await enrollmentService.markLessonComplete(
        req.params.courseId,
        req.params.lessonId,
        req.user
    );

    res.status(200).json({
        status: "success",
        message: "Lesson marked as completed",
        data: { enrollment },
    });
});

// ── Mark lesson incomplete ────────────────────────────────────────────────────
export const removeCompletedLesson = catchAsync(async (req, res) => {
    const enrollment = await enrollmentService.removeCompletedLesson(
        req.params.courseId,
        req.params.lessonId,
        req.user
    );

    res.status(200).json({
        status: "success",
        message: "Lesson marked as incomplete",
        data: { enrollment },
    });
});

// ── Update current lesson ─────────────────────────────────────────────────────
export const updateCurrentLesson = catchAsync(async (req, res) => {
    const enrollment = await enrollmentService.updateCurrentLesson(
        req.params.courseId,
        req.body.lessonId,
        req.user
    );

    res.status(200).json({
        status: "success",
        data: { enrollment },
    });
});

// ── Resume learning ───────────────────────────────────────────────────────────
export const getResumePoint = catchAsync(async (req, res) => {
    const resumePoint = await enrollmentService.getResumePoint(
        req.params.courseId,
        req.user
    );

    res.status(200).json({
        status: "success",
        data: resumePoint,
    });
});