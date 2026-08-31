import prisma from "../config/prisma.js";
import createError from "http-errors";

export const createGallery = async (productId: number) => {
  // Check product exists
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      deletedAt: null,
    },
  });

  if (!product) {
    throw createError(404, "Product not found");
  }

  // Check if gallery already exists
  const existingGallery = await prisma.gallery.findFirst({
    where: {
      product: {
        id: productId,
      },
    },
  });

  if (existingGallery) {
    throw createError(400, "Gallery already exists");
  }

  // Create gallery
  const gallery = await prisma.gallery.create({
    data: {
      product: {
        connect: {
          id: productId,
        },
      },
    },
  });

  return gallery;
};

export const getGalleryByProduct = async (productId: number) => {
  const gallery = await prisma.gallery.findFirst({
    where: {
      product: {
        id: productId,
        deletedAt: null,
      },
    },
    include: {
      images: true,
      media: true,
    },
  });

  if (!gallery) {
    throw createError(404, "Gallery not found");
  }

  return gallery;
};

export const updateGallery = async (galleryId: number, productId: number) => {
  const gallery = await prisma.gallery.findFirst({
    where: {
      id: galleryId,
      product: {
        id: productId,
        deletedAt: null,
      },
    },
  });

  if (!gallery) {
    throw createError(404, "Gallery not found");
  }

  return gallery;
};

export const deleteGallery = async (galleryId: number, productId: number) => {
  const gallery = await prisma.gallery.findFirst({
    where: {
      id: galleryId,
      product: {
        id: productId,
        deletedAt: null,
      },
    },
  });

  if (!gallery) {
    throw createError(404, "Gallery not found");
  }

  const deletedGallery = await prisma.gallery.delete({
    where: {
      id: galleryId,
    },
  });

  return deletedGallery;
};
