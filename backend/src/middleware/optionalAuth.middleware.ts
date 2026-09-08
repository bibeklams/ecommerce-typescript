import type { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";

import prisma from "../config/prisma.js";

interface AccessTokenPayload {
  userId: number;
}

const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.accessToken;

    // No token → guest user
    if (!token) {
      return next();
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!,
    ) as AccessTokenPayload;

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    // Token is valid but user doesn't exist
    if (!user) {
      return next();
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export default optionalAuth;
