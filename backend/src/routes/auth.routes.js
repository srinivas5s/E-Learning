import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

// Public
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected
router.use(protect); // all routes below require login

router.post("/logout", authController.logout);
router.get("/me", authController.getMe);
router.patch("/update-me", authController.updateMe);
router.patch("/change-password", authController.changePassword);

export default router;