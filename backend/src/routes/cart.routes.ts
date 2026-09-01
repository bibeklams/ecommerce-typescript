import express from "express";
import * as cartController from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/", cartController.getCart);
router.delete("/", cartController.clearCart);

export default router;
