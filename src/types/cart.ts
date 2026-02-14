// Cart Types
export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  addedAt: string;
  product: CartProduct;
  variant?: CartVariant | null;
}

export interface CartVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
  additionalPrice: string | number;
}

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  brand: string;
  price: number | string;
  discountPrice?: number | string | null;
  stock: number;
  images: { id: string; imageUrl: string; isPrimary?: boolean }[];
}

export interface AddToCartData {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface UpdateCartItemData {
  quantity: number;
}
