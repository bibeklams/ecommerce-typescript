import express from "express";

import * as orderController from "../controllers/order.controller.js";

import protect from "../middleware/auth.middleware.js";

import adminOnly, { sellerOnly } from "../middleware/role.middleware.js";

import { validation } from "../middleware/validation.middleware.js";

import { createOrderSchema } from "../validation/order.validate.js";

const router = express.Router();

// ====================
// Admin
// ====================

router.get("/count", protect, adminOnly, orderController.countOrder);

router.get("/", protect, adminOnly, orderController.getAllOrders);

router.put(
  "/:orderId/status",
  protect,
  adminOnly,
  orderController.updateOrderStatus,
);

// ====================
// Customer
// ====================

router.post(
  "/",
  protect,
  validation(createOrderSchema),
  orderController.createOrder,
);

router.get("/my", protect, orderController.getMyOrder);

router.get("/my/:orderId", protect, orderController.getMyOrderById);

router.put("/:orderId/cancel", protect, orderController.cancelOrder);

// ====================
// Seller
// ====================

router.get("/seller", protect, sellerOnly, orderController.getSellerAllOrders);

router.get(
  "/seller/:orderId",
  protect,
  sellerOnly,
  orderController.getSellerOrderByID,
);

router.put(
  "/seller/:orderId/status",
  protect,
  sellerOnly,
  orderController.updateSellerOrderStatus,
);

router.put(
  "/seller/:orderId/cancel",
  protect,
  sellerOnly,
  orderController.cancelSellerOrder,
);

// ====================
// Admin dynamic route
// ====================

router.get("/:orderId", protect, adminOnly, orderController.getOrderByID);

export default router;
