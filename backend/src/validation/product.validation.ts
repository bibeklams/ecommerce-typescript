import { z } from "zod";

export const createProduct = z.object({
  name: z.string().trim().max(50, { message: "Too long character for name" }),

  price: z.number().positive(),

  description: z.string().trim().optional(),

  detailsJson: z.record(z.string(), z.any()).optional(),

  categoryId: z.number().int().positive(),
});

export const updateProduct = z.object({
  name: z.string().trim().max(50, { message: "Too long character for name" }),

  price: z.number().positive(),

  description: z.string().trim().optional(),

  detailsJson: z.record(z.string(), z.any()).optional(),

  categoryId: z.number().int().positive(),
});
