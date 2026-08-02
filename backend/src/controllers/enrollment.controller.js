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