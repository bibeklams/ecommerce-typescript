import type { User } from "./user";
import type { Product } from "./product";
export interface WishlistItem {
  id: number;
  userId: number;
  productId: number;

  user: User;
  product: Product;
}
