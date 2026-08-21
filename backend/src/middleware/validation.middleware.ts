import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export const validation = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation Failed",
      });
    }

    req.body = result.data;

    next();
  };
};
