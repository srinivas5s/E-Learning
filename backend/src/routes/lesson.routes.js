import { Router } from "express";
import * as lessonController from "../controllers/lesson.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  createLessonSchema,
  updateLessonSchema,
  reorderLessonsSchema,
} from "../validators/lesson.validator.js";

// mergeParams: true — gives access to :moduleId from the parent router
const router = Router({ mergeParams: true });

// ── Public ────────────────────────────────────────────────────────────────────
// GET /api/v1/modules/:moduleId/lessons
// Guests and students see only published lessons
router.get("/", lessonController.getLessonsByModule);

// GET /api/v1/modules/:moduleId/lessons/:lessonId
// Preview lessons accessible without auth
router.get("/:lessonId", lessonController.getLessonById);

// ── Protected — instructor or admin only ──────────────────────────────────────
router.use(protect);

// POST /api/v1/modules/:moduleId/lessons
router.post(
  "/",
  authorize("instructor", "admin"),
  validate(createLessonSchema),
  lessonController.createLesson
);

// PATCH /api/v1/modules/:moduleId/lessons/reorder
// Must be before /:lessonId to avoid "reorder" being treated as an ID
router.patch(
  "/reorder",
  authorize("instructor", "admin"),
  validate(reorderLessonsSchema),
  lessonController.reorderLessons
);

// PATCH /api/v1/modules/:moduleId/lessons/:lessonId
router.patch(
  "/:lessonId",
  authorize("instructor", "admin"),
  validate(updateLessonSchema),
  lessonController.updateLesson
);

// PATCH /api/v1/modules/:moduleId/lessons/:lessonId/publish
router.patch(
  "/:lessonId/publish",
  authorize("instructor", "admin"),
  lessonController.togglePublishLesson
);

// DELETE /api/v1/modules/:moduleId/lessons/:lessonId
router.delete(
  "/:lessonId",
  authorize("instructor", "admin"),
  lessonController.deleteLesson
);

export default router;