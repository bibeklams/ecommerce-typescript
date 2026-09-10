import type { Category } from "./category";
import type { ProductGallery } from "./product";

export interface OrderItemProduct {
  id: number;
  name: string;
  price: number;
  category?: Category;
  gallery?: ProductGallery;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  total: number;
  product: OrderItemProduct;
  createdAt: string;
}
