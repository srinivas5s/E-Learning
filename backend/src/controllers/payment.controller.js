import catchAsync from "../utils/catchAsync.js";
import * as paymentService from "../services/payment.service.js";

export const createOrder = catchAsync(async (req, res) => {
    const result = await paymentService.createOrder(req.body.courseId, req.user);

    res.status(201).json({
        status: "success",
        message: "Order created successfully",
        data: result,
    });
});

export const handleCallback = (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, error } = req.body;

    const frontendBase = process.env.FRONTEND_URL || "http://localhost:5173";
    const params = new URLSearchParams();

    if (razorpay_payment_id) params.set("razorpay_payment_id", razorpay_payment_id);
    if (razorpay_order_id) params.set("razorpay_order_id", razorpay_order_id);
    if (razorpay_signature) params.set("razorpay_signature", razorpay_signature);
    if (error) params.set("error", "1");

    res.redirect(`${frontendBase}/payment/callback?${params.toString()}`);
};