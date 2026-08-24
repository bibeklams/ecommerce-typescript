import type { Request, Response, NextFunction } from "express";
import * as seoService from "../services/seo.service.js";

export const createSeo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, description, canonicalUrl } = req.body;
    const productId = Number(req.params.productId);

    const result = await seoService.createSeo({
      productId,
      title,
      description,
      canonicalUrl,
    });
    res.status(201).json({
      success: true,
      message: "successfully created seo",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSeoByProductId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productId = Number(req.params.productId);

    const result = await seoService.getSeoByProductId(productId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const updateSeo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, description, canonicalUrl } = req.body;

    const productId = Number(req.params.productId);

    const result = await seoService.updateSeo({
      productId,
      title,
      description,
      canonicalUrl,
    });

    return res.status(200).json({
      success: true,
      message: "SEO updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
