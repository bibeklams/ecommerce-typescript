import express from "express";

import * as paymentController from "../controllers/payment.controller.js";

import protect from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/role.middleware.js";

const router = express.Router();

// User
router.post("/:orderId", protect, paymentController.createPayment);

router.get("/:orderId", protect, paymentController.getMyPayment);

router.post("/:orderId/esewa", protect, paymentController.initiateEsewaPayment);

// Admin
router.get("/", protect, adminOnly, paymentController.getAllPayment);

router.patch(
  "/:paymentId/status",
  protect,
  adminOnly,
  paymentController.updatePaymentStatus,
);

router.patch("/:paymentId/refund", protect, paymentController.requestRefund);
router.patch(
  "/:paymentId/refund",
  protect,
  adminOnly,
  paymentController.updateRefundStatus,
);
export default router;
