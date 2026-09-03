import * as orderService from "../services/order.service.js";
import type { Request, Response, NextFunction } from "express";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { shippingName, shippingPhone, shippingAddress } = req.body;

    // userId should come from authenticated user
    const userId = req.user!.id;

    const order = await orderService.createOrder({
      userId,
      shippingName,
      shippingPhone,
      shippingAddress,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
export const getMyOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const search = String(req.query.search ?? "");
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);

    const userId = req.user!.id;

    const orders = await orderService.getMyOrders(userId, search, limit, page);

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};
export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const search = String(req.query.search ?? "");
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);

    const orders = await orderService.getAllOrders(search, limit, page);

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};
export const getMyOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const orderId = Number(req.params.orderId);

    const order = await orderService.getMyOrderById(userId, orderId);

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
export const getOrderByID = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orderId = Number(req.params.orderId);
    const result = await orderService.getOrderById(orderId);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orderId = Number(req.params.orderId);
    const status = req.body.status;
    const result = await orderService.updateOrderStatus(orderId, status);
    res.status(200).json({
      success: true,
      message: "updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const cancelOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const orderId = Number(req.params.orderId);

    const result = await orderService.cancelOrder(userId, orderId);

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const countOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await orderService.countOrder();
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
