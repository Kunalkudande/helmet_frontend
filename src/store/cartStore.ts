import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Cart, CartItem, AddToCartData } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  isUpdating: boolean;

  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (data: AddToCartData) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  setCart: (cart: Cart | null) => void;

  // Computed
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      isUpdating: false,

      fetchCart: async () => {
        set({ isLoading: true });
        try {
          const response = await api.get('/cart');
          set({ cart: response.data.data, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
        }
      },

      addToCart: async (data: AddToCartData) => {
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

      updateQuantity: async (itemId: string, quantity: number) => {
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

      removeItem: async (itemId: string) => {
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

      clearCart: async () => {
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

      setCart: (cart: Cart | null) => set({ cart }),

      totalItems: () => {
        const cart = get().cart;
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
      },

      totalPrice: () => {
        const cart = get().cart;
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
      }),
    }
  )
);
