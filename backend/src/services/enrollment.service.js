import { Enrollment } from "../models/enrollment.model.js";
import { Course } from "../models/course.model.js";
import AppError from "../utils/AppError.js";

// ── Helpers ───────────────────────────────────────────────────────────────────

const assertCourseEnrollable = async (courseId, user) => {
    const course = await Course.findById(courseId);
    if (!course) throw new AppError("Course not found", 404);

    if (!course.isPublished) {
        throw new AppError("This course is not available for enrollment", 400);
    }

    if (course.instructor.toString() === user._id.toString()) {
        throw new AppError("Instructors cannot enroll in their own course", 400);
    }

    return course;
};

const assertEnrollmentExists = async (studentId, courseId) => {
    const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
    if (!enrollment) throw new AppError("Enrollment not found", 404);
    return enrollment;
};

// ── Enroll student ────────────────────────────────────────────────────────────

export const enrollStudent = async (courseId, user) => {
    const course = await assertCourseEnrollable(courseId, user);

    const existing = await Enrollment.findOne({ student: user._id, course: courseId });
    if (existing) {
        throw new AppError("You are already enrolled in this course", 400);
    }

    const effectivePrice = course.discountPrice > 0 ? course.discountPrice : course.price;
    const enrollmentType = effectivePrice === 0 ? "free" : "paid";
    const paymentStatus = enrollmentType === "free" ? "free" : "pending";

    const enrollment = await Enrollment.create({
        student: user._id,
        course: courseId,
        enrollmentType,
        paymentStatus,
        pricePaid: effectivePrice,
    });

    // Keep Course.studentsEnrolled in sync — only count active enrollments
    await Course.findByIdAndUpdate(courseId, { $inc: { studentsEnrolled: 1 } });

    return enrollment;
};

// ── Get my enrollments ────────────────────────────────────────────────────────

export const getMyEnrollments = async (user) => {
    const enrollments = await Enrollment.find({ student: user._id, status: { $ne: "cancelled" } })
        .populate("course", "title slug thumbnail instructor level category")
        .sort({ enrolledAt: -1 });

    return enrollments;
};

// ── Get single enrollment by course ──────────────────────────────────────────

export const getEnrollmentByCourse = async (courseId, user) => {
    const enrollment = await assertEnrollmentExists(user._id, courseId);
    return enrollment;
};

// ── Cancel enrollment ─────────────────────────────────────────────────────────

export const cancelEnrollment = async (courseId, user) => {
    const enrollment = await assertEnrollmentExists(user._id, courseId);

    if (enrollment.status === "cancelled") {
        throw new AppError("This enrollment is already cancelled", 400);
    }

    enrollment.status = "cancelled";
    enrollment.cancelledAt = new Date();
    await enrollment.save();

    await Course.findByIdAndUpdate(courseId, { $inc: { studentsEnrolled: -1 } });

    return enrollment;
};