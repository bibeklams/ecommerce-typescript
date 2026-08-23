import { uploadToCloudinary } from "../utils/cloudinaryHandler.js";
import cloudinary from "../config/cloudinary.js";
import prisma from "../config/prisma.js";
import createError from "http-errors";

export const createCategoryImage = async (
  categoryId: number,
  file: Express.Multer.File,
) => {
  if (!file) {
    throw createError(400, "Category image is required");
  }

  const result = await uploadToCloudinary(file.buffer, "categories");

  const categoryImage = await prisma.categoryImage.create({
    data: {
      categoryId,
      url: result.secure_url,
      publicId: result.public_id,
    },
  });

  return categoryImage;
};

export const getCategoryImages = async () => {
  const categoryImages = await prisma.categoryImage.findMany({
    where: {
      category: {
        deletedAt: null,
      },
    },
  });

  return categoryImages;
};

export const updateCategoryImage = async (
  categoryId: number,
  file?: Express.Multer.File,
) => {
  if (!file) {
    throw createError(400, "Image is required");
  }

  const existingImage = await prisma.categoryImage.findUnique({
    where: {
      categoryId,
    },
  });

  if (!existingImage) {
    throw createError(404, "Category image not found");
  }

  const result = await uploadToCloudinary(file.buffer, "categories");

  const updatedCategoryImage = await prisma.categoryImage.update({
    where: {
      categoryId,
    },
    data: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });

  // Delete old image from Cloudinary
  if (existingImage.publicId) {
    await cloudinary.uploader.destroy(existingImage.publicId);
  }

  return updatedCategoryImage;
};

export const deleteCategoryImage = async (categoryId: number) => {
  const existingImage = await prisma.categoryImage.findUnique({
    where: {
      categoryId,
    },
  });

  if (!existingImage) {
    throw createError(404, "Category image not found");
  }

  // Delete image from Cloudinary
  if (existingImage.publicId) {
    await cloudinary.uploader.destroy(existingImage.publicId);
  }

  // Delete database record
  const deletedCategoryImage = await prisma.categoryImage.delete({
    where: {
      categoryId,
    },
  });

  return deletedCategoryImage;
};
