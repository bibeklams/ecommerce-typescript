import * as productService from "../services/product.service.js";

import type { Request, Response, NextFunction } from "express";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sellerId = req.user!.id;

    const { name, description, price, detailsJson, categoryId, quantity } =
      req.body;

    const files = req.files as {
      images?: Express.Multer.File[];
      media?: Express.Multer.File[];
    };

    const imageFiles = files?.images ?? [];
    const mediaFiles = files?.media ?? [];

    const result = await productService.createProduct(
      sellerId,
      {
        name,
        description,
        price: Number(price),
        categoryId: Number(categoryId),
        detailsJson,
        quantity: Number(quantity),
      },
      imageFiles,
      mediaFiles,
    );

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const search = String(req.query.search ?? "");

    const categoryId = req.query.categoryId
      ? Number(req.query.categoryId)
      : undefined;

    const result = await productService.getAllProducts(
      search,
      page,
      limit,
      categoryId,
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSellerAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sellerId = req.user!.id;
    const search = String(req.query.search ?? "");
    const limit = Number(req.query.limit ?? 20);
    const page = Number(req.query.page ?? 1);
    const result = await productService.getSellerAllProducts(
      sellerId,
      search,
      page,
      limit,
    );
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSingleProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    const result = await productService.getSingleProduct(id);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sellerId = req.user!.id;
    const id = Number(req.params.id);

    const { name, description, price, detailsJson, categoryId, quantity } =
      req.body;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const imageFiles = files?.images ?? [];
    const mediaFiles = files?.media ?? [];

    const result = await productService.updateProduct(
      sellerId,
      id,
      {
        name,
        description,
        price: price !== undefined ? Number(price) : undefined,
        detailsJson,
        categoryId: categoryId !== undefined ? Number(categoryId) : undefined,
        quantity: quantity !== undefined ? Number(quantity) : undefined,
      },
      imageFiles,
      mediaFiles,
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const countProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await productService.countProducts();

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    const sellerId = req.user!.id;
    const result = await productService.deleteProduct(id, sellerId);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
