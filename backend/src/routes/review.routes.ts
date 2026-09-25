import express from "express";
import protect from "../middleware/auth.middleware.js";
import * as reviewController from "../controllers/review.controller.js";
import { validation } from "../middleware/validation.middleware.js";
import {
  createReviewSchema,
  updateReviewSchema,
} from "../validation/review.validation.js";

const router = express.Router();

router.post(
  "/:productId",
  protect,
  validation(createReviewSchema),
  reviewController.createReview,
);

router.get("/:productId", reviewController.getProductReviews);

router.put(
  "/:productId",
  protect,
  validation(updateReviewSchema),
  reviewController.updateReview,
);

router.delete("/:productId", protect, reviewController.deleteReview);

export default router;
