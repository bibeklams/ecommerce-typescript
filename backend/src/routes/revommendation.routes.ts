import { Router } from "express";

import { getRecommendations } from "../controllers/recommendation.controller.js";

const router = Router();

router.get("/:productId/recommendations", getRecommendations);

export default router;
