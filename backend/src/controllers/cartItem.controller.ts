import * as cartItemService from "../services/cartitem.service.js";
import type { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import crypto from "crypto";

export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productId = Number(req.params.productId);
    const quantity = Number(req.body.quantity);

    if (Number.isNaN(productId)) {
      throw createError(400, "Invalid product ID");
    }

    if (Number.isNaN(quantity) || quantity <= 0) {
      throw createError(400, "Invalid quantity");
    }
    const userId = req.user?.id;
    let guestId = req.cookies.guestId;

    // Guest user
    if (!userId && !guestId) {
      guestId = crypto.randomUUID();

      res.cookie("guestId", guestId, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      });
    }

    const result = await cartItemService.addToCart({
      productId,
      quantity,
      userId,
      guestId,
    });

    return res.status(201).json({
      success: true,
      message: "Product added to cart",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productId = Number(req.params.productId);
    const quantity = Number(req.body.quantity);

    if (Number.isNaN(productId)) {
      throw createError(400, "Invalid product ID");
    }

    if (Number.isNaN(quantity) || quantity <= 0) {
      throw createError(400, "Invalid quantity");
    }

    const userId = req.user?.id;
    const guestId = req.cookies.guestId;

    if (!userId && !guestId) {
      throw createError(400, "Cart not found");
    }

    const result = await cartItemService.updateCartItem({
      productId,
      quantity,
      userId,
      guestId,
    });

    return res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productId = Number(req.params.productId);

    if (Number.isNaN(productId)) {
      throw createError(400, "Invalid product ID");
    }

    const userId = req.user?.id;
    const guestId = req.cookies.guestId;

    if (!userId && !guestId) {
      throw createError(400, "Cart not found");
    }

    const result = await cartItemService.removeCartItem({
      productId,
      userId,
      guestId,
    });

    return res.status(200).json({
      success: true,
      message: "Cart item removed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const countCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const guestId = req.cookies.guestId;
    if (!userId && !guestId) {
      throw createError(404, "Cart not found");
    }
    const result = await cartItemService.countCartItems({
      userId,
      guestId,
    });
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
