import * as productService from "../services/product.service.js";
import type { Request, Response, NextFunction } from "express";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, description, price, detailsJson } = req.body;

    const categoryId = Number(req.params.categoryId);

    const result = await productService.createProduct({
      name,
      description,
      price,
      categoryId,
      detailsJson,
    });

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

    const result = await productService.getAllProducts(search, page, limit);

    res.status(200).json({
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
    res.status(200).json({
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
    const id = Number(req.params.id);

    const { name, description, price, detailsJson, categoryId } = req.body;

    const result = await productService.updateProduct(id, {
      name,
      description,
      price,
      detailsJson,
      categoryId,
    });

    res.status(200).json({
      success: true,
      message: "Updated Successfully",
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
    const result = await productService.countProduct();
    res.status(200).json({
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
    const result = await productService.deleteProduct(id);
    res.status(200).json({
      success: true,
      message: "Deleted Successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
