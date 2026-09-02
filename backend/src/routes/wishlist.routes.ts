import * as wishlistController from "../controllers/wishlist.controller.js";
import express from "express";

const router = express.Router();

router.get("/count", wishlistController.countWishlist);
router.post("/:productId", wishlistController.createWishlist);
router.get("/", wishlistController.getWishlist);
router.delete("/:productId", wishlistController.removeWishlist);

export default router;
