import express from "express";

import * as categoryController from "../controllers/category.controller.js";

import protect from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/role.middleware.js";

import upload from "../middleware/upload.middleware.js";

import { validation } from "../middleware/validation.middleware.js";

import {
  createCategory,
  updateCategory,
} from "../validation/category.validation.js";

const router = express.Router();

router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  validation(createCategory),
  categoryController.createCategory,
);

router.get("/", categoryController.getAllCategories);

router.get("/count", protect, adminOnly, categoryController.countCategories);

router.get("/:id", categoryController.getSingleCategory);

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  validation(updateCategory),
  categoryController.updateCategory,
);

router.delete("/:id", protect, adminOnly, categoryController.deleteCategory);

export default router;
