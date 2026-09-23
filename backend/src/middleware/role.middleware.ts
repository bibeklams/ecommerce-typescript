import type { Request, Response, NextFunction } from "express";
import createError from "http-errors";

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  console.log("🔥 ADMIN ONLY HIT:", req.originalUrl);

  try {
    if (!req.user) {
      throw createError(401, "Authentication required");
    }

    if (req.user.role !== "ADMIN") {
      throw createError(403, "Only admin can access");
    }

    next();
  } catch (error) {
    next(error);
  }
};
export const sellerOnly = (req: Request, res: Response, next: NextFunction) => {
  console.log("🟢 SELLER ONLY HIT:", req.originalUrl);

  try {
    if (!req.user) {
      throw createError(401, "Authentication required");
    }

    if (req.user.role !== "SELLER") {
      throw createError(403, "Only seller can access");
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default adminOnly;
