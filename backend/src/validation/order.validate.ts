import { z } from "zod";

export const createOrderSchema = z.object({
  shippingName: z
    .string()
    .min(2, "Shipping name must be at least 2 characters")
    .max(100, "Shipping name is too long")
    .trim(),

  shippingPhone: z
    .string()
    .min(7, "Invalid phone number")
    .max(20, "Phone number is too long")
    .trim(),

  shippingAddress: z
    .string()
    .min(5, "Shipping address is too short")
    .max(255, "Shipping address is too long")
    .trim(),
});
