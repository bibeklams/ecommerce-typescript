export type Role = "USER" | "ADMIN";
export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}
