import type { Cart } from "./cart";
import type { Product } from "./product";
export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;

  cart: Cart;
  product: Product;
}
