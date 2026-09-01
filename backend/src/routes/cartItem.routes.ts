import express from "express";
import * as cartItemController from "../controllers/cartItem.controller.js";

const router = express.Router();

router.get("/count", cartItemController.countCartItem);
router.post("/:productId", cartItemController.addToCart);

router.patch("/:productId", cartItemController.updateCartItem);

router.delete("/:productId", cartItemController.removeCartItem);

export default router;
