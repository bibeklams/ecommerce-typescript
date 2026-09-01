import * as wishlistController from "../controllers/wishlist.controller.js";
import protect from "../middleware/auth.middleware.js";
import express from "express";

const router = express.Router();

router.get("/count", protect, wishlistController.countWishlist);

router.post("/:productId", protect, wishlistController.createWishlist);

router.get("/", protect, wishlistController.getWishlist);

router.delete("/:productId", protect, wishlistController.removeWishlist);

export default router;
