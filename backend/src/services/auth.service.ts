import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import createError from "http-errors";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (existingUser) {
    throw createError(400, "User already exist");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
  return user;
};
export const login = async (data: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (!user) {
    throw createError(400, "No user found");
  }
  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) {
    throw createError(401, "Invalid email or password");
  }
  const accessToken = generateAccessToken({
    userId: user.id,
    role: user.role,
  });
  const refreshToken = generateRefreshToken({
    userId: user.id,
  });
  const { password, ...safeUser } = user;

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
};
export const refreshToken = async (token: string) => {
  if (!token) {
    throw createError(401, "Invalid token");
  }

  let decoded: jwt.JwtPayload;

  try {
    decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET!,
    ) as jwt.JwtPayload;
  } catch {
    throw createError(403, "Invalid or expired token");
  }

  if (!decoded.userId) {
    throw createError(401, "Invalid refresh token");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: Number(decoded.userId),
    },
  });

  if (!user) {
    throw createError(401, "User not found");
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    role: user.role,
  });

  return {
    accessToken,
  };
};
