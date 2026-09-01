import type { User } from "./user";
import type { CartItem } from "./cartItem";
export interface Cart {
  id: number;
  userId?: number;
  guestId?: string;

  user?: User;
  items: CartItem[];
}
