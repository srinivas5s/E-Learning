import { Router } from "express";
import * as enrollmentController from "../controllers/enrollment.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
    createEnrollmentSchema,
    courseParamSchema,
} from "../validators/enrollment.validator.js";

const router = Router();

router.use(protect);

router.post(
    "/",
    authorize("student"),
    validate(createEnrollmentSchema),
    enrollmentController.enrollStudent
);

router.get(
    "/my",
    authorize("student"),
    enrollmentController.getMyEnrollments
);

router.get(
    "/:courseId",
    authorize("student"),
    validate(courseParamSchema, "params"),
    enrollmentController.getEnrollmentByCourse
);

router.delete(
    "/:courseId",
    authorize("student"),
    validate(courseParamSchema, "params"),
    enrollmentController.cancelEnrollment
);

export default router;