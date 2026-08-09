import { Payment } from "../models/payment.model.js";
import { Course } from "../models/course.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import razorpay from "../config/razorpay.js";
import AppError from "../utils/AppError.js";

const PENDING_ORDER_REUSE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// ── Create Razorpay order for a course purchase ───────────────────────────────

export const createOrder = async (courseId, user) => {
    const course = await Course.findById(courseId);
    if (!course) throw new AppError("Course not found", 404);

    if (course.status !== "published") {
        throw new AppError("This course is not available for purchase", 400);
    }

    const price = course.discountPrice > 0 ? course.discountPrice : course.price;
    if (typeof price !== "number" || !(price > 0)) {
        throw new AppError("This course does not have a valid price", 400);
    }

    // Already enrolled — no payment needed
    const existingEnrollment = await Enrollment.findOne({
        student: user._id,
        course: courseId,
        status: { $ne: "cancelled" },
    });
    if (existingEnrollment) {
        throw new AppError("You are already enrolled in this course", 409);
    }

    // Reuse a recent, still-pending order instead of creating a duplicate
    // Razorpay order on every retry/double-click
    const recentPending = await Payment.findOne({
        student: user._id,
        course: courseId,
        status: { $in: ["created", "pending"] },
        createdAt: { $gte: new Date(Date.now() - PENDING_ORDER_REUSE_WINDOW_MS) },
    }).sort({ createdAt: -1 });

    if (recentPending) {
        return {
            orderId: recentPending.razorpayOrderId,
            amount: recentPending.amount,
            currency: recentPending.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
            courseName: course.title,
        };
    }

    const amountInPaise = Math.round(price * 100);

    const razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `rcpt_${courseId}_${Date.now()}`,
    });

    // Only reached if Razorpay succeeded — no Payment doc is ever created
    // representing a failed/nonexistent order
    await Payment.create({
        student: user._id,
        course: courseId,
        amount: amountInPaise,
        currency: "INR",
        razorpayOrderId: razorpayOrder.id,
        status: "created",
    });

    return {
        orderId: razorpayOrder.id,
        amount: amountInPaise,
        currency: "INR",
        keyId: process.env.RAZORPAY_KEY_ID,
        courseName: course.title,
    };
};