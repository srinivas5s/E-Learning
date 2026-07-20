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

router.use(protect);

router.get("/", lessonController.getLessonsByModule);

router.get("/:lessonId", lessonController.getLessonById);

router.post(
  "/",
  authorize("instructor", "admin"),
  validate(createLessonSchema),
  lessonController.createLesson
);

router.patch(
  "/reorder",
  authorize("instructor", "admin"),
  validate(reorderLessonsSchema),
  lessonController.reorderLessons
);

router.patch(
  "/:lessonId",
  authorize("instructor", "admin"),
  validate(updateLessonSchema),
  lessonController.updateLesson
);

router.patch(
  "/:lessonId/publish",
  authorize("instructor", "admin"),
  lessonController.togglePublishLesson
);

router.delete(
  "/:lessonId",
  authorize("instructor", "admin"),
  lessonController.deleteLesson
);

export default router;