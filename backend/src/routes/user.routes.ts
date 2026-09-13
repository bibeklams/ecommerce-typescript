import protect from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/role.middleware.js";
import * as userController from "../controllers/user.controller.js";
import express from "express";

const router = express();

router.get("/", protect, adminOnly, userController.getAllUsers);
router.get("/:userId", protect, adminOnly, userController.getSingleUser);
router.delete("/:userId", protect, adminOnly, userController.deleteUser);

export default router;
