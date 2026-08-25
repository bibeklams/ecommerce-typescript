// src/types/product.ts
import type { Seo } from "./seo";
export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  slug: string;
  detailsJson?: string;
  categoryId: number;
  galleryId: number;
  seo?: Seo;
}
