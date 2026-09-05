export interface OrderItemProduct {
  id: number;
  name: string;
  price: number;
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
