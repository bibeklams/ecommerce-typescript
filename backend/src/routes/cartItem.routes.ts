import express from "express";
import * as cartItemController from "../controllers/cartItem.controller.js";
import optionalAuth from "../middleware/optionalAuth.middleware.js";
const router = express.Router();

router.get("/items/count", optionalAuth, cartItemController.countCartItem);

router.post("/items/:productId", optionalAuth, cartItemController.addToCart);

router.patch(
  "/items/:productId",
  optionalAuth,
  cartItemController.updateCartItem,
);

router.delete(
  "/items/:productId",
  optionalAuth,
  cartItemController.removeCartItem,
);

export default router;
