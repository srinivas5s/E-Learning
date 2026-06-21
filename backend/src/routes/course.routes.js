import { Router } from "express";
import * as courseController from "../controllers/course.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
    createCourseSchema,
    updateCourseSchema,
} from "../validators/course.validator.js";

const router = Router();

// ── Public routes — no auth required ─────────────────────────────────────────
router.get("/", courseController.getAllCourses);
router.get("/:slug", courseController.getCourseBySlug);

// ── All routes below require authentication ───────────────────────────────────
router.use(protect);

// ── Instructor routes — instructor or admin only ──────────────────────────────
router.post(
    "/",
    authorize("instructor", "admin"),
    validate(createCourseSchema),
    courseController.createCourse
);

router.get(
    "/instructor/my-courses",
    authorize("instructor", "admin"),
    courseController.getInstructorCourses
);

router.get(
    "/instructor/:id",
    authorize("instructor", "admin"),
    courseController.getCourseById
);

router.patch(
    "/:id",
    authorize("instructor", "admin"),
    validate(updateCourseSchema),
    courseController.updateCourse
);

router.patch(
    "/:id/publish",
    authorize("instructor", "admin"),
    courseController.togglePublish
);

router.delete(
    "/:id",
    authorize("instructor", "admin"),
    courseController.deleteCourse
);

export default router;