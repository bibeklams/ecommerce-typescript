import express from "express";
import * as cartItemController from "../controllers/cartItem.controller.js";

const router = express.Router();

router.get("/items/count", cartItemController.countCartItem);
router.post("/items/:productId", cartItemController.addToCart);

router.patch("/items/:productId", cartItemController.updateCartItem);

router.delete("/items/:productId", cartItemController.removeCartItem);

export default router;
