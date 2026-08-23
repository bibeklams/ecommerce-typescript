import { uploadToCloudinary } from "../utils/cloudinaryHandler.js";
import createError from "http-errors";
import prisma from "../config/prisma.js";
import cloudinary from "../config/cloudinary.js";

export const createMedia = async (
  galleryId: number,
  files: Express.Multer.File[],
) => {
  if (!files || files.length === 0) {
    throw createError(400, "Please upload at least one file");
  }

  const uploadedMedia = await Promise.all(
    files.map(async (file) => {
      let type: "VIDEO" | "PDF";

      if (file.mimetype.startsWith("video/")) {
        type = "VIDEO";
      } else if (file.mimetype === "application/pdf") {
        type = "PDF";
      } else {
        throw createError(400, "Only video and PDF files are allowed");
      }

      const result = await uploadToCloudinary(file.buffer, "productMedia");

      return {
        galleryId,
        url: result.secure_url,
        publicId: result.public_id,
        type,
      };
    }),
  );

  const media = await prisma.media.createMany({
    data: uploadedMedia,
  });

  return media;
};

export const getAllMedia = async (productId: number) => {
  const medias = await prisma.media.findMany({
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

  return medias;
};

export const updateMedia = async (
  mediaId: number,
  file: Express.Multer.File,
) => {
  if (!file) {
    throw createError(400, "Please upload a file");
  }

  // Check existing media
  const existingMedia = await prisma.media.findUnique({
    where: {
      id: mediaId,
    },
  });

  if (!existingMedia) {
    throw createError(404, "Media not found");
  }

  // Determine media type
  let type: "VIDEO" | "PDF";

  if (file.mimetype.startsWith("video/")) {
    type = "VIDEO";
  } else if (file.mimetype === "application/pdf") {
    type = "PDF";
  } else {
    throw createError(400, "Only video and PDF files are allowed");
  }

  // Upload new file
  const result = await uploadToCloudinary(file.buffer, "productMedia");

  // Update database
  const updatedMedia = await prisma.media.update({
    where: {
      id: mediaId,
    },
    data: {
      url: result.secure_url,
      publicId: result.public_id,
      type,
    },
  });

  // Delete old file from Cloudinary
  if (existingMedia.publicId) {
    await cloudinary.uploader.destroy(existingMedia.publicId);
  }

  return updatedMedia;
};

export const deleteMedia = async (mediaId: number) => {
  const existingMedia = await prisma.media.findUnique({
    where: {
      id: mediaId,
    },
  });

  if (!existingMedia) {
    throw createError(404, "Media not found");
  }

  // Delete file from Cloudinary
  if (existingMedia.publicId) {
    await cloudinary.uploader.destroy(existingMedia.publicId);
  }

  // Delete record from PostgreSQL
  const deletedMedia = await prisma.media.delete({
    where: {
      id: mediaId,
    },
  });

  return deletedMedia;
};
