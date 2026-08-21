import express from "express";
import authRoutes from "./auth.routes.js";
import categoryRoutes from "./category.routes.js";
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
export default router;
