// Common / Shared Types
import type { Order } from './order';
import type { Review, Pagination } from './product';

export type { Review, Pagination };

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface CreateReviewData {
  productId: string;
  rating: number;
  title: string;
  comment: string;
  images?: File[];
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  validFrom: string;
  validUntil: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: Order[];
  lowStockProducts: { id: string; name: string; stock: number; sku: string; images: any[] }[];
  monthlySales: { month: string; revenue: number; orders: number }[];
}

// Re-export all types
export type { Product, ProductImage, ProductVariant, ProductSpecification, ProductCategory, ProductSize, ProductFilters, ProductsResponse } from './product';
export type { User, UserRole, AuthResponse, LoginCredentials, RegisterCredentials, Address, AddressType, UpdateProfileData, ChangePasswordData } from './user';
export type { Order, OrderItem, ShippingAddress, OrderStatus, PaymentMethod, PaymentStatus, CreateOrderData, VerifyPaymentData } from './order';
export type { Cart, CartItem, CartProduct, AddToCartData, UpdateCartItemData } from './cart';
