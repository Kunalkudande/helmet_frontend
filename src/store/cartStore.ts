import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Cart, CartItem, AddToCartData } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface CartState {
  cart: Cart | null;
  guestCart: Cart | null; // Local cart for unauthenticated users
  isLoading: boolean;
  isUpdating: boolean;

  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (data: AddToCartData, isAuthenticated: boolean) => Promise<void>;
  addToGuestCart: (data: AddToCartData) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number, isAuthenticated: boolean) => Promise<void>;
  removeItem: (itemId: string, isAuthenticated: boolean) => Promise<void>;
  clearCart: (isAuthenticated: boolean) => Promise<void>;
  setCart: (cart: Cart | null) => void;
  mergeGuestCart: () => Promise<void>;
  clearGuestCart: () => void;

  // Computed
  totalItems: (isAuthenticated: boolean) => number;
  totalPrice: (isAuthenticated: boolean) => number;
  getActiveCart: (isAuthenticated: boolean) => Cart | null;
}

// Generate a local ID for guest cart items
const localId = () => `guest_${Math.random().toString(36).slice(2, 10)}`;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      guestCart: null,
      isLoading: false,
      isUpdating: false,

      getActiveCart: (isAuthenticated: boolean) => {
        return isAuthenticated ? get().cart : get().guestCart;
      },

      fetchCart: async () => {
        set({ isLoading: true });
        try {
          const response = await api.get('/cart');
          set({ cart: response.data.data, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
        }
      },

      addToGuestCart: async (data: AddToCartData) => {
        set({ isUpdating: true });
        try {
          // Fetch product info for display
          const response = await api.get(`/products/${data.productId}`);
          const product = response.data.data;
          const variant = data.variantId
            ? product.variants?.find((v: any) => v.id === data.variantId)
            : null;

          const guestCart = get().guestCart || {
            id: 'guest',
            userId: 'guest',
            items: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // Check if item already exists in guest cart
          const existingIndex = guestCart.items.findIndex(
            (item) => item.productId === data.productId && item.variantId === (data.variantId || null)
          );

          let updatedItems: CartItem[];
          if (existingIndex >= 0) {
            updatedItems = guestCart.items.map((item, idx) =>
              idx === existingIndex
                ? { ...item, quantity: item.quantity + data.quantity }
                : item
            );
          } else {
            const primaryImage = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];
            const newItem: CartItem = {
              id: localId(),
              cartId: 'guest',
              productId: data.productId,
              variantId: data.variantId || null,
              quantity: data.quantity,
              addedAt: new Date().toISOString(),
              product: {
                id: product.id,
                name: product.name,
                slug: product.slug,
                brand: product.brand,
                price: product.price,
                discountPrice: product.discountPrice,
                stock: product.stock,
                images: primaryImage ? [primaryImage] : [],
              },
              variant: variant
                ? {
                    id: variant.id,
                    size: variant.size,
                    color: variant.color,
                    stock: variant.stock,
                    additionalPrice: variant.additionalPrice || 0,
                  }
                : null,
            };
            updatedItems = [...guestCart.items, newItem];
          }

          set({
            guestCart: { ...guestCart, items: updatedItems, updatedAt: new Date().toISOString() },
            isUpdating: false,
          });
          toast.success('Added to cart!');
        } catch (error: any) {
          set({ isUpdating: false });
          toast.error('Failed to add to cart');
        }
      },

      addToCart: async (data: AddToCartData, isAuthenticated: boolean) => {
        if (!isAuthenticated) {
          return get().addToGuestCart(data);
        }
        set({ isUpdating: true });
        try {
          const response = await api.post('/cart/items', data);
          set({ cart: response.data.data, isUpdating: false });
          toast.success('Added to cart!');
        } catch (error: any) {
          set({ isUpdating: false });
          const message = error.response?.data?.error || 'Failed to add to cart';
          toast.error(message);
        }
      },

      updateQuantity: async (itemId: string, quantity: number, isAuthenticated: boolean) => {
        if (!isAuthenticated) {
          const guestCart = get().guestCart;
          if (!guestCart) return;
          const updatedItems = guestCart.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          );
          set({ guestCart: { ...guestCart, items: updatedItems, updatedAt: new Date().toISOString() } });
          return;
        }
        set({ isUpdating: true });
        try {
          const response = await api.put(`/cart/items/${itemId}`, { quantity });
          set({ cart: response.data.data, isUpdating: false });
        } catch (error: any) {
          set({ isUpdating: false });
          const message = error.response?.data?.error || 'Failed to update quantity';
          toast.error(message);
        }
      },

      removeItem: async (itemId: string, isAuthenticated: boolean) => {
        if (!isAuthenticated) {
          const guestCart = get().guestCart;
          if (!guestCart) return;
          const updatedItems = guestCart.items.filter((item) => item.id !== itemId);
          set({
            guestCart: updatedItems.length > 0
              ? { ...guestCart, items: updatedItems, updatedAt: new Date().toISOString() }
              : null,
          });
          toast.success('Item removed from cart');
          return;
        }
        set({ isUpdating: true });
        try {
          const response = await api.delete(`/cart/items/${itemId}`);
          set({ cart: response.data.data, isUpdating: false });
          toast.success('Item removed from cart');
        } catch (error: any) {
          set({ isUpdating: false });
          const message = error.response?.data?.error || 'Failed to remove item';
          toast.error(message);
        }
      },

      clearCart: async (isAuthenticated: boolean) => {
        if (!isAuthenticated) {
          set({ guestCart: null });
          toast.success('Cart cleared');
          return;
        }
        set({ isUpdating: true });
        try {
          await api.delete('/cart');
          set({ cart: null, isUpdating: false });
          toast.success('Cart cleared');
        } catch (error) {
          set({ isUpdating: false });
          toast.error('Failed to clear cart');
        }
      },

      // Merge guest cart into server cart after login
      mergeGuestCart: async () => {
        const guestCart = get().guestCart;
        if (!guestCart || guestCart.items.length === 0) return;

        try {
          for (const item of guestCart.items) {
            await api.post('/cart/items', {
              productId: item.productId,
              variantId: item.variantId || undefined,
              quantity: item.quantity,
            });
          }
          // Fetch the merged server cart
          const response = await api.get('/cart');
          set({ cart: response.data.data, guestCart: null });
        } catch (error) {
          // Silently fail merge — cart items might be unavailable
          set({ guestCart: null });
        }
      },

      clearGuestCart: () => set({ guestCart: null }),

      setCart: (cart: Cart | null) => set({ cart }),

      totalItems: (isAuthenticated: boolean) => {
        const cart = isAuthenticated ? get().cart : get().guestCart;
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
      },

      totalPrice: (isAuthenticated: boolean) => {
        const cart = isAuthenticated ? get().cart : get().guestCart;
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((sum: number, item: any) => {
          const price = item.product?.discountPrice
            ? Number(item.product.discountPrice)
            : Number(item.product?.price || 0);
          const variantExtra = item.variant?.additionalPrice ? Number(item.variant.additionalPrice) : 0;
          return sum + (price + variantExtra) * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
        guestCart: state.guestCart,
      }),
    }
  )
);
