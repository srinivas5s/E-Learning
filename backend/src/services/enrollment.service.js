import { Enrollment } from "../models/enrollment.model.js";
import { Course } from "../models/course.model.js";
import { Lesson } from "../models/lesson.model.js";
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

const recalculateProgress = async (enrollment) => {
    const totalPublished = await Lesson.countDocuments({
        course: enrollment.course,
        isPublished: true,
    });

    const percent = totalPublished > 0
        ? Math.round((enrollment.completedLessons.length / totalPublished) * 100)
        : 0;

    enrollment.progressPercent = percent;

    if (percent >= 100 && enrollment.status === "active") {
        enrollment.status = "completed";
        enrollment.completedAt = new Date();
    }
};

// ── Mark lesson as completed ──────────────────────────────────────────────────

export const markLessonComplete = async (courseId, lessonId, user) => {
    const enrollment = await assertEnrollmentExists(user._id, courseId);

    const lesson = await Lesson.findOne({ _id: lessonId, course: courseId });
    if (!lesson) throw new AppError("Lesson not found in this course", 404);

    const alreadyCompleted = enrollment.completedLessons.some(
        (id) => id.toString() === lessonId
    );

    if (!alreadyCompleted) {
        enrollment.completedLessons.push(lessonId);
        await recalculateProgress(enrollment);
    }

    enrollment.currentLesson = lessonId;
    enrollment.lastAccessedAt = new Date();
    await enrollment.save();

    return enrollment;
};

// ── Mark lesson as incomplete (toggle) ────────────────────────────────────────

export const removeCompletedLesson = async (courseId, lessonId, user) => {
    const enrollment = await assertEnrollmentExists(user._id, courseId);

    enrollment.completedLessons = enrollment.completedLessons.filter(
        (id) => id.toString() !== lessonId
    );

    await recalculateProgress(enrollment);
    await enrollment.save();

    return enrollment;
};

// ── Get course progress ───────────────────────────────────────────────────────

export const getCourseProgress = async (courseId, user) => {
    const enrollment = await assertEnrollmentExists(user._id, courseId);
    return enrollment;
};

// ── Update current lesson (called when student navigates in the player) ─────

export const updateCurrentLesson = async (courseId, lessonId, user) => {
    const enrollment = await assertEnrollmentExists(user._id, courseId);

    const lesson = await Lesson.findOne({ _id: lessonId, course: courseId });
    if (!lesson) throw new AppError("Lesson not found in this course", 404);

    enrollment.currentLesson = lessonId;
    enrollment.lastAccessedAt = new Date();
    await enrollment.save();

    return enrollment;
};

// ── Resume learning — returns where the student should continue ─────────────

export const getResumePoint = async (courseId, user) => {
    const enrollment = await assertEnrollmentExists(user._id, courseId);

    if (enrollment.currentLesson) {
        return { lessonId: enrollment.currentLesson };
    }

    const firstLesson = await Lesson.findOne({ course: courseId, isPublished: true })
        .sort({ order: 1 });

    if (!firstLesson) {
        throw new AppError("This course has no published lessons yet", 404);
    }

    return { lessonId: firstLesson._id };
};