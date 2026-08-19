import express from "express";
import * as authController from "../controllers/auth.controller.js";
import { loginRateLimiter } from "../middleware/rateLimiter.middleware.js";
import protect from "../middleware/auth.middleware.js";
const router=express.Router();

router.post("/register",authController.register);
router.post("/login",loginRateLimiter,authController.login);
router.post("/refresh-token",authController.refreshToken);
router.get("/profile",protect,authController.profile);
export default router