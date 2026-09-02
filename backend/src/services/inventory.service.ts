import prisma from "../config/prisma.js";
import createError from "http-errors";

export const createInventory = async (productId: number, quantity: number) => {
  // Check if product exists
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      deletedAt: null,
    },
  });

  if (!product) {
    throw createError(404, "No product found");
  }

  // Check if inventory already exists
  const existingInventory = await prisma.inventory.findUnique({
    where: {
      productId,
    },
  });

  if (existingInventory) {
    throw createError(409, "Inventory already exists");
  }

  // Create inventory
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
  // Check if inventory exists
  const inventory = await prisma.inventory.findUnique({
    where: {
      productId,
    },
  });

  if (!inventory) {
    throw createError(404, "Inventory not found");
  }

  // Update inventory
  const updatedInventory = await prisma.inventory.update({
    where: {
      productId,
    },
    data: {
      quantity,
    },
    select: {
      id: true,
      productId: true,
      quantity: true,
    },
  });

  return updatedInventory;
};
