import { Router }            from "express";
import * as moduleController  from "../controllers/module.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import validate               from "../middlewares/validate.middleware.js";
import {
  createModuleSchema,
  updateModuleSchema,
  reorderModulesSchema,
} from "../validators/module.validator.js";

// mergeParams: true — gives access to :courseId from the parent router
const router = Router({ mergeParams: true });

// ── Public ────────────────────────────────────────────────────────────────────
// GET /api/v1/courses/:courseId/modules
// Guests and students see only published modules + lessons
router.get("/", moduleController.getModulesByCourse);

// ── Protected — instructor or admin only ──────────────────────────────────────
router.use(protect);

// POST /api/v1/courses/:courseId/modules
router.post(
  "/",
  authorize("instructor", "admin"),
  validate(createModuleSchema),
  moduleController.createModule
);

// PATCH /api/v1/courses/:courseId/modules/reorder
// Must be before /:moduleId to avoid "reorder" being treated as an ID
router.patch(
  "/reorder",
  authorize("instructor", "admin"),
  validate(reorderModulesSchema),
  moduleController.reorderModules
);

// PATCH /api/v1/courses/:courseId/modules/:moduleId
router.patch(
  "/:moduleId",
  authorize("instructor", "admin"),
  validate(updateModuleSchema),
  moduleController.updateModule
);

// DELETE /api/v1/courses/:courseId/modules/:moduleId
router.delete(
  "/:moduleId",
  authorize("instructor", "admin"),
  moduleController.deleteModule
);

export default router;