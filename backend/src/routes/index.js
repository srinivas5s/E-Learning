import { Router } from "express";

import authRoutes from "./auth.routes.js";
import courseRoutes from "./course.routes.js";
import moduleRoutes from "./module.routes.js";
import lessonRoutes from "./lesson.routes.js";

const router = Router();

// Auth
router.use("/auth", authRoutes);

// Courses
router.use("/courses", courseRoutes);

// Modules
router.use("/courses/:courseId/modules", moduleRoutes);

// Lessons
router.use("/modules/:moduleId/lessons", lessonRoutes);

export default router;