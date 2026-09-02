import { z } from "zod";

const detailsJsonSchema = z.preprocess((value) => {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  return value;
}, z.record(z.string(), z.any()).optional());

export const createProduct = z.object({
  name: z.string().trim().max(50, {
    message: "Too long character for name",
  }),

  price: z.coerce.number().positive(),

  description: z.string().trim().optional(),

  detailsJson: detailsJsonSchema,

  categoryId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive(),
});

export const updateProduct = z.object({
  name: z
    .string()
    .trim()
    .max(50, {
      message: "Too long character for name",
    })
    .optional(),

  price: z.coerce.number().positive().optional(),

  description: z.string().trim().optional(),

  detailsJson: detailsJsonSchema,

  categoryId: z.coerce.number().int().positive().optional(),

  quantity: z.coerce.number().int().positive().optional(),
});
