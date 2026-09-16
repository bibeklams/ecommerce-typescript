export type Role = "USER" | "ADMIN" | "SELLER";

export type SellerStatus = "NONE" | "PENDING" | "APPROVED" | "REJECTED";
export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  sellerStatus: SellerStatus;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
