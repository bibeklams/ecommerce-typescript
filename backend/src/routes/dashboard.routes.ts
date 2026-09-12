import express from "express";
import * as dashboardController from "../controllers/dashboard.controller.js";
import protect from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, dashboardController.getDashboardStats);
router.get(
  "/recent-orders",
  protect,
  adminOnly,
  dashboardController.getRecentOrders,
);
router.get(
  "/top-products",
  protect,
  adminOnly,
  dashboardController.getTopSellingProducts,
);
router.get(
  "/low-stock",
  protect,
  adminOnly,
  dashboardController.getLowStockProducts,
);
router.get("/sales", protect, adminOnly, dashboardController.getSalesOverview);

export default router;
