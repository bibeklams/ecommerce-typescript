import type { Product } from "./product";
import type { CategoryImage } from "./categoryImage";
export interface Category {
  id: number;
  name: string;
  description?: string;
  parentId?: number;

  categoryImage?: CategoryImage;

  parent?: Category;
  children?: Category[];

  products?: Product[];
}
