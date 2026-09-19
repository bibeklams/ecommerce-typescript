import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import prisma from "../config/prisma.js";

interface AccessTokenPayload {
  userId: number;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      throw createError(401, "Please login");
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!,
    ) as AccessTokenPayload;

    console.log("JWT USER ID:", decoded.userId);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!user) {
      throw createError(404, "No user found");
    }

    console.log("AUTH USER:", {
      id: user.id,
      email: user.email,
      role: user.role,
      sellerStatus: user.sellerStatus,
    });

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export default protect;
