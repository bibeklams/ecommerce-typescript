import express from "express";
import * as dashboardController from "../controllers/dashboard.controller.js";
import protect from "../middleware/auth.middleware.js";
import adminOnly, { sellerOnly } from "../middleware/role.middleware.js";

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

//seller

router.get(
  "/seller/stats",
  protect,
  sellerOnly,
  dashboardController.getSellerDashboardStats,
);
router.get(
  "/seller/recent-orders",
  protect,
  sellerOnly,
  dashboardController.getSellerRecentOrders,
);

router.get(
  "/seller/top-products",
  protect,
  sellerOnly,
  dashboardController.getSellerTopSellingProducts,
);

router.get(
  "/seller/sales-overview",
  protect,
  sellerOnly,
  dashboardController.getSellerSalesOverview,
);

router.get(
  "/seller/low-stock",
  protect,
  sellerOnly,
  dashboardController.getSellerLowStockProducts,
);

export default router;
