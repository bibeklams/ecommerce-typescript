import prisma from "../config/prisma.js";
import createError from "http-errors";

export const createInventory = async (productId: number, quantity: number) => {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      deletedAt: null,
    },
  });
  if (!product) {
    throw createError(404, "No product found");
  }
  const inventory = await prisma.inventory.create({
    data: {
      productId,
      quantity,
    },
    select: {
      id: true,
      quantity: true,
    },
  });
  return inventory;
};

export const updateInventory = async (productId: number, quantity: number) => {
  const inventory = await prisma.inventory.findUnique({
    where: {
      productId,
    },
  });

  if (!inventory) {
    throw createError(404, "Inventory not found");
  }

  const updatedInventory = await prisma.inventory.update({
    where: {
      productId,
    },
    data: {
      quantity,
    },
  });

  return updatedInventory;
};
