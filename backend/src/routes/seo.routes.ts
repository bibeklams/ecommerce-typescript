import express from "express";
import * as seoController from "../controllers/seo.controller.js";

import { createSeo, updateSeo } from "../validation/seo.validation.js";
import protect from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/role.middleware.js";
import { validation } from "../middleware/validation.middleware.js";

const router = express.Router();

router.post(
  "/:productId/seo",
  protect,
  adminOnly,
  validation(createSeo),
  seoController.createSeo,
);

router.get("/:productId/seo", seoController.getSeoByProductId);

router.put(
  "/:productId/seo",
  protect,
  adminOnly,
  validation(updateSeo),
  seoController.updateSeo,
);

export default router;
