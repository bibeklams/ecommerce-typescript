import prisma from "../config/prisma.js";
import createError from "http-errors";
import { uploadToCloudinary } from "../utils/cloudinaryHandler.js";

export const createGalleryImages = async (
  galleryId: number,
  files: Express.Multer.File[],
) => {
  if (!files || files.length === 0) {
    throw createError(400, "Please upload at least one image");
  }

  const uploadedImages = await Promise.all(
    files.map(async (file) => {
      if (!file.mimetype.startsWith("image/")) {
        throw createError(400, "Only image files are allowed");
      }

      const result = await uploadToCloudinary(file.buffer, "productImages");

      return {
        galleryId,
        url: result.secure_url,
        publicId: result.public_id,
      };
    }),
  );

  const galleryImages = await prisma.galleryImage.createMany({
    data: uploadedImages,
  });

  return galleryImages;
};

export const getGalleryImages = async (productId: number) => {
  const galleryImages = await prisma.galleryImage.findMany({
    where: {
      gallery: {
        product: {
          id: productId,
          deletedAt: null,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return galleryImages;
};

export const getSingleGalleryImage = async (imageId: number) => {
  const galleryImage = await prisma.galleryImage.findFirst({
    where: {
      id: imageId,
      gallery: {
        product: {
          deletedAt: null,
        },
      },
    },
  });

  if (!galleryImage) {
    throw createError(404, "Gallery image not found");
  }

  return galleryImage;
};

export const updateGalleryImage = async (
  imageId: number,
  file: Express.Multer.File,
) => {
  if (!file) {
    throw createError(400, "Image is required");
  }

  if (!file.mimetype.startsWith("image/")) {
    throw createError(400, "Only image files are allowed");
  }

  const existingImage = await prisma.galleryImage.findFirst({
    where: {
      id: imageId,
      gallery: {
        product: {
          deletedAt: null,
        },
      },
    },
  });

  if (!existingImage) {
    throw createError(404, "Gallery image not found");
  }

  const result = await uploadToCloudinary(file.buffer, "productImages");

  const updatedImage = await prisma.galleryImage.update({
    where: {
      id: imageId,
    },
    data: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });

  return updatedImage;
};

export const deleteGalleryImage = async (imageId: number) => {
  const existingImage = await prisma.galleryImage.findFirst({
    where: {
      id: imageId,
      gallery: {
        product: {
          deletedAt: null,
        },
      },
    },
  });

  if (!existingImage) {
    throw createError(404, "Gallery image not found");
  }

  const deletedImage = await prisma.galleryImage.delete({
    where: {
      id: imageId,
    },
  });

  return deletedImage;
};
