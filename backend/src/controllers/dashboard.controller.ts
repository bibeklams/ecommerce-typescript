import * as dashboardService from "../services/dashboard.service.js";
import type { Request, Response, NextFunction } from "express";

export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await dashboardService.getDashboardStats();
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await dashboardService.getRecentOrders();
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getTopSellingProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await dashboardService.getTopSellingProducts();
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSalesOverview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await dashboardService.getSalesOverview();
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getLowStockProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await dashboardService.getLowStockProducts();
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSellerDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sellerId = req.user!.id;
    const result = await dashboardService.getSellerDashboardStats(sellerId);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSellerRecentOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sellerId = req.user!.id;
    const result = await dashboardService.getSellerRecentOrders(sellerId);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSellerTopSellingProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sellerId = req.user!.id;
    const result = await dashboardService.getSellerTopSellingProducts(sellerId);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSellerSalesOverview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sellerId = req.user!.id;
    const result = await dashboardService.getSellerSalesOverview(sellerId);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSellerLowStockProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sellerId = req.user!.id;
    const result = await dashboardService.getSellerLowStockProducts(sellerId);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
