import type { Request, Response, NextFunction } from "express";

import { getRecommendedProducts } from "../services/recommendation.service.js";

export const getRecommendations = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productId = Number(req.params.productId);

    if (Number.isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const products = await getRecommendedProducts(productId);

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};
