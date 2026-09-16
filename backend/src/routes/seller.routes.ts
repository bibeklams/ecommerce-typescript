import protect from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/role.middleware.js";
import { sellerOnly } from "../middleware/role.middleware.js";
import * as sellerController from "../controllers/seller.controller.js";
import express from "express";

const router = express.Router();

router.post("/apply-seller", protect, sellerController.applyForSeller);
router.patch(
  "/:userId/approve-seller",
  protect,
  adminOnly,
  sellerController.approveSeller,
);
router.patch(
  "/:userId/reject-seller",
  protect,
  adminOnly,
  sellerController.rejectSeller,
);
router.patch(
  "/deactive-seller",
  protect,
  sellerOnly,
  sellerController.deactivateSeller,
);

export default router;
