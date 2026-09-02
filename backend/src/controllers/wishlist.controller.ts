import * as wishlistService from "../services/wishlist.service.js";
import type { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import crypto from "crypto";

export const createWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    let guestId = req.cookies?.guestId;

    const productId = Number(req.params.productId);

    if (Number.isNaN(productId)) {
      throw createError(400, "Invalid product ID");
    }
    if (!userId && !guestId) {
      guestId = crypto.randomUUID();

      res.cookie("guestId", guestId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      });
    }

    const result = await wishlistService.createWishlist({
      userId,
      guestId,
      productId,
    });

    return res.status(201).json({
      success: true,
      message: "Successfully added to wishlist",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// GET WISHLIST
export const getWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const guestId = req.cookies?.guestId;

    if (!userId && !guestId) {
      throw createError(400, "User ID or Guest ID is required");
    }

    const result = await wishlistService.getWishlist({
      userId,
      guestId,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// REMOVE WISHLIST
export const removeWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const guestId = req.cookies?.guestId;

    const productId = Number(req.params.productId);

    if (Number.isNaN(productId)) {
      throw createError(400, "Invalid product ID");
    }

    if (!userId && !guestId) {
      throw createError(400, "User ID or Guest ID is required");
    }

    const result = await wishlistService.removeWishlist({
      userId,
      guestId,
      productId,
    });

    return res.status(200).json({
      success: true,
      message: "Successfully removed from wishlist",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// COUNT WISHLIST
export const countWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const guestId = req.cookies?.guestId;

    if (!userId && !guestId) {
      throw createError(400, "User ID or Guest ID is required");
    }

    const result = await wishlistService.countWishlist({
      userId,
      guestId,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
