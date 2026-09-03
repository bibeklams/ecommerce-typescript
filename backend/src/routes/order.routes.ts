import express from "express";
import * as orderController from "../controllers/order.controller.js";

import protect from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/count", protect, adminOnly, orderController.countOrder);
router.post("/", protect, orderController.createOrder);
router.get("/my", protect, orderController.getMyOrder);
router.get("/", protect, adminOnly, orderController.getAllOrders);

router.get("/my/:orderId", protect, orderController.getMyOrderById);
router.get("/:orderId", protect, adminOnly, orderController.getOrderByID);

router.put(
  "/:orderId/status",
  protect,
  adminOnly,
  orderController.updateOrderStatus,
);

router.put("/:orderId/cancel", protect, orderController.cancelOrder);

export default router;
