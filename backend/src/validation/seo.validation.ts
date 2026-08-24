import { z } from "zod";

export const createSeo = z.object({
  title: z.string().trim().optional(),
  description: z.string().trim().optional(),
  canonicalUrl: z.string().trim().optional(),
});

export const updateSeo = z.object({
  title: z.string().trim().optional(),
  description: z.string().trim().optional(),
  canonicalUrl: z.string().trim().optional(),
});
