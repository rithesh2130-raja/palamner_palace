export interface ProductImage {
  url: string;
  publicId?: string;
  alt?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  brand?: string;
  category: string;
  subcategory?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku: string;
  images: ProductImage[];
  rating: number;
  reviewCount: number;
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | string;
  search?: string;
  isFeatured?: boolean;
}

export interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: ProductPagination;
  };
  message?: string;
}

export interface SingleProductResponse {
  success: boolean;
  data: Product;
  message?: string;
}
