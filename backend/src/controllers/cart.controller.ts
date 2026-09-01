import * as cartService from "../services/cart.service.js";
import type { Request, Response, NextFunction } from "express";

export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const guestId = req.cookies.guestId;

    const result = await cartService.getCart({
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

export const clearCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const guestId = req.cookies.guestId;

    const result = await cartService.clearCart({
      userId,
      guestId,
    });

    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
