import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import createError from "http-errors";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import { generateOtp } from "../utils/generateOtp.js";
import { sendVerificationEmail } from "./email.service.js";
import redis from "../config/redis.js";
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
    throw createError(400, "User already exists");
  }

  // Hash password before storing it
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  });

  // Remove password before returning user
  const { password, ...safeUser } = user;

  const otp = generateOtp();

  const hashOtp = await bcrypt.hash(otp, 10);
  await redis.set(`email-verification:${user.id}`, hashOtp, "EX", 300);
  await sendVerificationEmail({
    email: user.email,
    name: user.name,
    otp,
  });

  return safeUser;
};

export const verifyEmail = async (email: string, otp: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
    },
  });

  if (!user) {
    throw createError(400, "No email found");
  }
  if (user.emailVerified) {
    throw createError(400, "Email already verified");
  }
  const otpDoc = await redis.get(`email-verification:${user.id}`);

  if (!otpDoc) {
    throw createError(400, "OTP expired or not found");
  }

  const verifyOtp = await bcrypt.compare(otp, otpDoc);

  if (!verifyOtp) {
    throw createError(400, "Invalid OTP");
  }

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      emailVerified: true,
    },
  });

  await redis.del(`email-verification:${user.id}`);
  return "Email verified successfully";
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
