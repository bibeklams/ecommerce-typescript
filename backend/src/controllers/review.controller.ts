import * as reviewService from "../services/review.service.js";
import type { Request, Response, NextFunction } from "express";

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const productId = Number(req.params.productId);

    const { rating, comment } = req.body;

    res
      .status(201)
      .json(
        await reviewService.createReview(userId, productId, rating, comment),
      );
  } catch (error) {
    next(error);
  }
};

export const getProductReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productId = Number(req.params.productId);
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 5);
    res.json(await reviewService.getProductReviews(productId, page, limit));
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const productId = Number(req.params.productId);
    res.json(await reviewService.deleteReview(userId, productId));
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const productId = Number(req.params.productId);

    const { rating, comment } = req.body;

    res.json(
      await reviewService.updateReview(userId, productId, rating, comment),
    );
  } catch (error) {
    next(error);
  }
};
