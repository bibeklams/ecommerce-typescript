import express from "express";

import protect from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/role.middleware.js";
import { validation } from "../middleware/validation.middleware.js";

import upload from "../middleware/upload.middleware.js";

import {
  createProduct,
  updateProduct,
} from "../validation/product.validation.js";

import * as productController from "../controllers/product.controller.js";

const router = express.Router();

router.post(
  "/",
  protect,
  adminOnly,
  upload.fields([
    {
      name: "images",
      maxCount: 10,
    },
    {
      name: "media",
      maxCount: 5,
    },
  ]),
  validation(createProduct),
  productController.createProduct,
);

router.get("/", productController.getAllProducts);

router.get("/count", protect, adminOnly, productController.countProduct);

router.get("/:id", productController.getSingleProduct);

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.fields([
    {
      name: "images",
      maxCount: 10,
    },
    {
      name: "media",
      maxCount: 5,
    },
  ]),
  validation(updateProduct),
  productController.updateProduct,
);

router.delete("/:id", protect, adminOnly, productController.deleteProduct);

export default router;
