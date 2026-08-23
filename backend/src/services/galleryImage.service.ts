import prisma from "../config/prisma.js";
import { uploadToCloudinary } from "../utils/cloudinaryHandler.js";
import createError from "http-errors";
import cloudinary from "../config/cloudinary.js";

export const createGalleryImages = async (
  galleryId: number,
  files: Express.Multer.File[],
) => {
  if (!files || files.length === 0) {
    throw createError(400, "Please upload at least one image");
  }

  const uploadedImages = await Promise.all(
    files.map(async (file) => {
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

// export const getSingleGalleryImage = async (imageId: number) => {
//   const galleryImage = await prisma.galleryImage.findUnique({
//     where: {
//       id: imageId,
//     },
//     include: {
//       gallery: {
//         include: {
//           product: true,
//         },
//       },
//     },
//   });

//   if (!galleryImage) {
//     throw createError(404, "Gallery image not found");
//   }

//   if (galleryImage.gallery.product?.deletedAt !== null) {
//     throw createError(404, "Product not found");
//   }

//   return galleryImage;
// };

export const updateGalleryImage = async (
  imageId: number,
  file: Express.Multer.File,
) => {
  if (!file) {
    throw createError(400, "Please upload an image");
  }

  const existingImage = await prisma.galleryImage.findUnique({
    where: {
      id: imageId,
    },
    include: {
      gallery: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!existingImage) {
    throw createError(404, "Gallery image not found");
  }

  if (existingImage.gallery.product?.deletedAt !== null) {
    throw createError(404, "Product not found");
  }

  // Upload new image
  const result = await uploadToCloudinary(file.buffer, "productImages");

  // Update database
  const updatedImage = await prisma.galleryImage.update({
    where: {
      id: imageId,
    },
    data: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });

  // Delete old Cloudinary image
  if (existingImage.publicId) {
    await cloudinary.uploader.destroy(existingImage.publicId);
  }

  return updatedImage;
};

export const deleteGalleryImage = async (imageId: number) => {
  const existingImage = await prisma.galleryImage.findUnique({
    where: {
      id: imageId,
    },
    include: {
      gallery: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!existingImage) {
    throw createError(404, "Gallery image not found");
  }

  if (existingImage.gallery.product?.deletedAt !== null) {
    throw createError(404, "Product not found");
  }

  // Delete from Cloudinary
  if (existingImage.publicId) {
    await cloudinary.uploader.destroy(existingImage.publicId);
  }

  // Delete from PostgreSQL
  const deletedImage = await prisma.galleryImage.delete({
    where: {
      id: imageId,
    },
  });

  return deletedImage;
};
