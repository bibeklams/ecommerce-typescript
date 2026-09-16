import prisma from "../config/prisma.js";
import createError from "http-errors";
import { SellerStatus, Role } from "../generated/prisma/client.js";
import {
  sendSellerApplicationEmail,
  sendSellerApprovedEmail,
  sendSellerRejectedEmail,
  sendSellerDeactivatedEmail,
} from "./email.service.js";

export const createSeller = async (userId: number) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      emailVerified: true,
      deletedAt: null,
    },
  });

  if (!user) {
    throw createError(400, "No user found");
  }

  if (user.sellerStatus === SellerStatus.PENDING) {
    throw createError(400, "Request already pending");
  }

  if (user.sellerStatus === SellerStatus.APPROVED) {
    throw createError(400, "Already approved");
  }

  const updateUserToSeller = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      sellerStatus: SellerStatus.PENDING,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      sellerStatus: true,
      emailVerified: true,
    },
  });
  await sendSellerApplicationEmail({
    email: user.email,
    name: user.name,
  });
  return updateUserToSeller;
};

export const approveSeller = async (userId: number) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      emailVerified: true,
      sellerStatus: SellerStatus.PENDING,
    },
  });
  if (!user) {
    throw createError(400, "No user found");
  }
  const approveSellerRequest = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      sellerStatus: SellerStatus.APPROVED,
      role: Role.SELLER,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      sellerStatus: true,
      emailVerified: true,
    },
  });
  await sendSellerApprovedEmail({
    email: user.email,
    name: user.name,
  });
  return approveSellerRequest;
};

export const rejectSeller = async (userId: number) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      emailVerified: true,
      sellerStatus: SellerStatus.PENDING,
    },
  });
  if (!user) {
    throw createError(400, "No user found");
  }
  const rejectSellerRequest = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      sellerStatus: SellerStatus.REJECTED,
      role: Role.USER,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      sellerStatus: true,
      emailVerified: true,
    },
  });
  await sendSellerRejectedEmail({
    email: user.email,
    name: user.name,
  });
  return rejectSellerRequest;
};

export const deactivateSeller = async (userId: number) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      role: Role.SELLER,
      emailVerified: true,
      deletedAt: null,
    },
  });
  if (!user) {
    throw createError(400, "No User found");
  }
  const updateSellerToUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      role: Role.USER,
      sellerStatus: SellerStatus.NONE,
    },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      role: true,
    },
  });
  await sendSellerDeactivatedEmail({
    email: user.email,
    name: user.name,
  });
  return updateSellerToUser;
};
