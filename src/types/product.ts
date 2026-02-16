// Product Types

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  isApproved: boolean;
  isVerifiedPurchase: boolean;
  user: {
    fullName: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number | string | null;
  category: ProductCategory;
  brand: string;
  sku: string;
  stock: number;
  isActive: boolean;
  rating: number | string;
  totalReviews: number;
  images: ProductImage[];
  variants: ProductVariant[];
  specifications?: ProductSpecification | null;
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  alt?: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface ProductVariant {
  id: string;
  size: ProductSize;
  color: string;
  stock: number;
  additionalPrice?: number | string;
}

export interface ProductSpecification {
  id: string;
  weight: string;
  material: string;
  certifications: string[];
  visorType: string;
  ventilation: boolean;
  features: string[];
}

export type ProductCategory = 'FULL_FACE' | 'HALF_FACE' | 'OPEN_FACE' | 'MODULAR' | 'OFF_ROAD' | 'KIDS' | 'LADIES';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'FREE_SIZE';

export interface ProductFilters {
  category?: ProductCategory;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  size?: ProductSize;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
}

export interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
}
