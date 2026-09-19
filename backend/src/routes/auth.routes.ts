import express from "express";

import * as authController from "../controllers/auth.controller.js";

import { loginRateLimiter } from "../middleware/rateLimiter.middleware.js";

import protect from "../middleware/auth.middleware.js";

import { validation } from "../middleware/validation.middleware.js";

import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  resetPasswordSchema,
} from "../validation/auth.validation.js";

const router = express.Router();

router.post("/register", validation(registerSchema), authController.register);
router.post("/verify-email", authController.verifyEmail);
router.post("/forgot-password", authController.forgotPassword);

router.post("/verify-reset-otp", authController.verifyResetOtp);

router.patch(
  "/reset-password",
  validation(resetPasswordSchema),
  authController.resetPassword,
);

router.patch(
  "/change-password",
  protect,
  validation(changePasswordSchema),
  authController.changePassword,
);
router.post(
  "/login",
  validation(loginSchema),
  loginRateLimiter,
  authController.login,
);

router.post("/refresh-token", authController.refreshToken);
router.post("/logout", protect, authController.logout);
router.get("/profile", protect, authController.profile);

export default router;
