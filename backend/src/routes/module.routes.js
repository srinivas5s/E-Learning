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

router.get("/", moduleController.getModulesByCourse);

// ── Protected — instructor or admin only ──────────────────────────────────────
router.use(protect);

router.post(
  "/",
  authorize("instructor", "admin"),
  validate(createModuleSchema),
  moduleController.createModule
);

router.patch(
  "/reorder",
  authorize("instructor", "admin"),
  validate(reorderModulesSchema),
  moduleController.reorderModules
);

router.patch(
  "/:moduleId",
  authorize("instructor", "admin"),
  validate(updateModuleSchema),
  moduleController.updateModule
);

router.delete(
  "/:moduleId",
  authorize("instructor", "admin"),
  moduleController.deleteModule
);

export default router;