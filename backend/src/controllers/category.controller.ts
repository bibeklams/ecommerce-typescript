import { Result } from "pg";
import * as categoryService from "../services/category.service.js";
import type { Request, Response, NextFunction } from "express";

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, description, parentId } = req.body;

    const result = await categoryService.createCategory({
      name,
      description,
      parentId,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await categoryService.getAllCategories();
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSingleCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    const result = await categoryService.getSingleCategory(id);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, description, parentId } = req.body;
    const id = Number(req.params.id);

    const result = await categoryService.updateCategory(id, {
      name,
      description,
      parentId,
    });
    res.status(200).json({
      success: true,
      message: "Successfully Updated ",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    const result = await categoryService.deleteCategory(id);
    res.status(200).json({
      success: true,
      message: "Successfully deleted",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
