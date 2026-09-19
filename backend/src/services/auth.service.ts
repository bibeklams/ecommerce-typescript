import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import createError from "http-errors";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import { generateOtp } from "../utils/generateOtp.js";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "./email.service.js";
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

  // User already exists
  if (existingUser && existingUser.deletedAt === null) {
    throw createError(400, "User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  let user;

  // Soft-deleted user exists → restore account
  if (existingUser && existingUser.deletedAt !== null) {
    user = await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        name: data.name,
        password: hashedPassword,
        deletedAt: null,
        emailVerified: false,
      },
    });
  } else {
    // No user exists → create new account
    user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });
  }

  // Remove password before returning user
  const { password, ...safeUser } = user;

  // Generate OTP
  const otp = generateOtp();

  // Hash OTP before storing it in Redis
  const hashOtp = await bcrypt.hash(otp, 10);

  // Store OTP hash for 5 minutes
  await redis.set(`email-verification:${user.id}`, hashOtp, "EX", 300);

  // Send OTP email
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

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
    },
  });

  if (!user) {
    throw createError(400, "No user found");
  }

  const otpDoc = generateOtp();

  const hashOtp = await bcrypt.hash(otpDoc, 10);

  await redis.set(`forgotPassword:${user.id}`, hashOtp, "EX", 300);

  await sendResetPasswordEmail({
    email: user.email,
    name: user.name,
    otp: otpDoc,
  });
};

export const verifyResetOtp = async (email: string, otp: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
      emailVerified: true,
    },
  });
  if (!user) {
    throw createError(400, "No User found");
  }
  const otpDoc = await redis.get(`forgotPassword:${user.id}`);
  if (!otpDoc) {
    throw createError(400, "Otp expire");
  }
  const verifyOtp = await bcrypt.compare(otp, otpDoc);
  if (!verifyOtp) {
    throw createError(400, "Invalid Otp");
  }

  await redis.del(`forgotPassword:${user.id}`);

  await redis.set(`resetVerified:${user.id}`, "true", "EX", 600);
};

export const resetPassword = async (email: string, newPassword: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
      emailVerified: true,
    },
  });

  if (!user) {
    throw createError(400, "No user found");
  }

  const verifyUser = await redis.get(`resetVerified:${user.id}`);

  if (!verifyUser) {
    throw createError(400, "Please verify OTP first");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  await redis.del(`resetVerified:${user.id}`);

  return "Password updated successfully";
};

export const changePassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string,
) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      deletedAt: null,
    },
  });

  if (!user) {
    throw createError(403, "Unauthorized user");
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    throw createError(400, "Invalid password");
  }

  const hashPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashPassword,
    },
  });

  return "Password changed successfully";
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
