import type { Category } from "./category";

export interface ProductImage {
  id: number;
  url: string;
  createdAt?: string;
}

export interface ProductMedia {
  id: number;
  url: string;
  type: string;
  createdAt?: string;
}

export interface ProductGallery {
  id: number;
  images: ProductImage[];
  media: ProductMedia[];
}
export interface Inventory {
  id: number;
  productId: number;
  quantity: number;

  product: Product;
}
export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  categoryId: number;
  detailsJson?: Record<string, unknown>;
  inventory: Inventory;
  category?: Category;

  gallery?: ProductGallery;
}
