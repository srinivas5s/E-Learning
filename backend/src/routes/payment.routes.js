import { Router } from "express";
import * as paymentController from "../controllers/payment.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { createOrderSchema } from "../validators/payment.validator.js";

const router = Router();

router.use(protect);

router.post(
    "/create-order",
    authorize("student"),
    validate(createOrderSchema),
    paymentController.createOrder
);

export default router;