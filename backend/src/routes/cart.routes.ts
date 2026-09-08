import express from "express";

import * as cartController from "../controllers/cart.controller.js";
import optionalAuth from "../middleware/optionalAuth.middleware.js";

const router = express.Router();

router.get("/", optionalAuth, cartController.getCart);

router.delete("/", optionalAuth, cartController.clearCart);

export default router;
