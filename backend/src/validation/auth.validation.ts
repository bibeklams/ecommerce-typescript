import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(4, {
      error: "Name must be at least 4 characters",
    })
    .max(20, {
      error: "Name must not exceed 20 characters",
    }),

  email: z
    .email({
      error: "Please provide a valid email address",
    })
    .trim()
    .toLowerCase()
    .max(254, {
      error: "Email must not exceed 254 characters",
    }),

  password: z
    .string()
    .min(8, {
      error: "Password must be at least 8 characters",
    })
    .max(128, {
      error: "Password must not exceed 128 characters",
    }),
});

export const loginSchema = z.object({
  email: z
    .email({
      error: "Please provide a valid email address",
    })
    .trim()
    .toLowerCase()
    .max(254, {
      error: "Email must not exceed 254 characters",
    }),

  password: z.string().min(1, {
    error: "Password is required",
  }),
});