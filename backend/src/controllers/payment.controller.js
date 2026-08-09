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