import * as wishlistService from "../services/wishlist.service.js";
import type { Request, Response, NextFunction } from "express";
import createError from "http-errors";

export const createWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user.id;
    const productId = Number(req.params.productId);

    if (Number.isNaN(productId)) {
      throw createError(400, "Invalid product ID");
    }

    const result = await wishlistService.createWishlist({
      userId,
      productId,
    });

    res.status(201).json({
      success: true,
      message: "Successfully added to wishlist",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user.id;

    const result = await wishlistService.getWishlist(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const removeWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user.id;
    const productId = Number(req.params.productId);

    if (Number.isNaN(productId)) {
      throw createError(400, "Invalid product ID");
    }

    const result = await wishlistService.removeWishlist({
      userId,
      productId,
    });

    res.status(200).json({
      success: true,
      message: "Successfully removed from wishlist",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const countWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user.id;

    const result = await wishlistService.countWishlist(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
