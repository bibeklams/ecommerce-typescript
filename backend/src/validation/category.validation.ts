import { z } from "zod";

export const createCategory = z.object({
  name: z.string().trim().max(20, {
    message: "Name must not exceed 20 characters",
  }),
  description: z.string().trim().optional(),
  parentId: z.number().int().optional(),
});

export const updateCategory = z.object({
  name: z
    .string()
    .trim()
    .max(20, {
      message: "Name must not exceed 20 characters",
    })
    .optional(),
  description: z.string().trim().optional(),
  parentId: z.number().int().optional(),
});
