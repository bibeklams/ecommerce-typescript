import prisma from "../config/prisma.js";
import createError from "http-errors";
import redis from "../config/redis.js";
import { Role } from "../generated/prisma/client.js";

export const getAllUsers = async (
  search: string = "",
  page: number = 1,
  limit: number = 20,
) => {
  const skip = (page - 1) * limit;

  const cacheKey = `users:search:${search}:page:${page}:limit:${limit}`;

  // Check Redis cache
  const cache = await redis.get(cacheKey);

  if (cache) {
    return JSON.parse(cache);
  }

  const where = {
    deletedAt: null,
    role: {
      not: Role.ADMIN,
    },
    OR: [
      {
        name: {
          contains: search,
          mode: "insensitive" as const,
        },
      },
      {
        email: {
          contains: search,
          mode: "insensitive" as const,
        },
      },
    ],
  };

  // Get users
  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take: limit,
  });

  // Get total users
  const total = await prisma.user.count({
    where,
  });

  const result = {
    users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };

  // Cache for 5 minutes
  await redis.set(cacheKey, JSON.stringify(result), "EX", 300);

  return result;
};

export const getSingleUser = async (userId: number) => {
  const cacheKey = `user:${userId}`;

  // Check Redis cache
  const cache = await redis.get(cacheKey);

  if (cache) {
    return JSON.parse(cache);
  }

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      role: true,
    },
  });

  if (!user) {
    throw createError(404, "User not found");
  }

  await redis.set(cacheKey, JSON.stringify(user), "EX", 300);

  return user;
};

export const deleteUser = async (userId: number) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      deletedAt: null,
    },
  });

  if (!user) {
    throw createError(404, "User not found");
  }

  if (user.role === Role.ADMIN) {
    throw createError(403, "Admin users cannot be deleted");
  }

  const removeUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  // Invalidate single-user cache
  await redis.del(`user:${userId}`);

  // Invalidate all user-list caches
  const userKeys = await redis.keys("users:*");

  if (userKeys.length > 0) {
    await redis.del(...userKeys);
  }

  return removeUser;
};
