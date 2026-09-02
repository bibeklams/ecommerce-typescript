import type { Product } from "./product";

export interface WishlistItem {
  id: number;
  productId: number;
  product: Product;
  createdAt: string;
}
