import express from "express";
import authRoutes from "./auth.routes.js";
import categoryRoutes from "./category.routes.js";
import productRoutes from "./product.routes.js";
import seoRoutes from "./seo.routes.js";
import wishlistRoutes from "./wishlist.routes.js";
import cartItemRoutes from "./cartItem.routes.js";
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/products", seoRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/cartItem", cartItemRoutes);
export default router;
