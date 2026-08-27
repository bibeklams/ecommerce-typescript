export interface ProductImage {
  id: number;
  url: string;
  createdAt?: string;
}

export interface ProductMedia {
  id: number;
  url: string;
  type?: string;
  createdAt?: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  description?: string;
}

export interface ProductSeo {
  id: number;
  title: string;
  description?: string;
  canonicalUrl?: string;
}

export interface Product {
  id: number;

  name: string;
  slug: string;
  description?: string;

  price: number;

  categoryId: number;

  detailsJson?: object;

  category?: ProductCategory;

  seo?: ProductSeo;

  gallery?: {
    id: number;
    images: ProductImage[];
    media: ProductMedia[];
  };

  createdAt?: string;
  updatedAt?: string;
}
