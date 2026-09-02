import type { ProductGallery } from "./product";

export interface CartItemProduct {
  id: number;
  name: string;
  price: number;
  gallery?: ProductGallery;
}

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  product: CartItemProduct;
}
