import * as paymentService from "../services/payment.service.js";
import type { Request, Response, NextFunction } from "express";

export const createPayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const orderId = Number(req.params.orderId);
    const method = req.body.method;

    const payment = await paymentService.createPayment(userId, orderId, method);
    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyPayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const orderId = Number(req.params.orderId);

    const payment = await paymentService.getMyPayment(userId, orderId);

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const search = String(req.query.search ?? "");
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);

    const payment = await paymentService.getAllPayments(search, page, limit);

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};
export const updatePaymentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const status = req.body.status;
    const paymentId = Number(req.params.paymentId);

    const payment = await paymentService.updatePaymentStatus(paymentId, status);

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};
export const requestRefund = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const paymentId = Number(req.params.paymentId);
    const refundRequest = await paymentService.requestRefund(userId, paymentId);
    res.status(200).json({
      success: true,
      message: "Successfully requested",
      data: refundRequest,
    });
  } catch (error) {
    next(error);
  }
};
export const updateRefundStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const paymentId = Number(req.params.paymentId);
    const { status } = req.body;

    const payment = await paymentService.updateRefundStatus(paymentId, status);

    res.status(200).json({
      success: true,
      message: "Refund status updated successfully",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

export const initiateEsewaPayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const orderId = Number(req.params.orderId);

    const paymentData = await paymentService.initiateEsewaPayment(
      userId,
      orderId,
    );

    res.status(200).json({
      success: true,
      message: "eSewa payment initiated",
      data: paymentData,
    });
  } catch (error) {
    next(error);
  }
};
