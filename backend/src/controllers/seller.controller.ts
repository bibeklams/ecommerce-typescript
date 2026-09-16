import * as sellerService from "../services/seller.service.js";
import type { Request, Response, NextFunction } from "express";

export const applyForSeller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    res.status(201).send(await sellerService.createSeller(userId));
  } catch (error) {
    next(error);
  }
};

export const approveSeller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = Number(req.params.userId);

    console.log("req.params:", req.params);
    console.log("Approving user ID:", userId);

    res.send(await sellerService.approveSeller(userId));
  } catch (error) {
    next(error);
  }
};

export const rejectSeller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = Number(req.params.userId);
    res.send(await sellerService.rejectSeller(userId));
  } catch (error) {
    next(error);
  }
};

export const deactivateSeller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    res.send(await sellerService.deactivateSeller(userId));
  } catch (error) {
    next(error);
  }
};
