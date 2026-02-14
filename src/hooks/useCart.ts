'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import type { AddToCartData } from '@/types';

export function useCart() {
  const {
    cart,
    isLoading,
    isUpdating,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    totalItems,
    totalPrice,
  } = useCartStore();

  const { isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const hasFetched = useRef(false);

  useEffect(() => {
    // Skip cart fetch on admin pages — cart is not needed there
    if (pathname?.startsWith('/admin')) return;
    // Only fetch once per session, or when auth state changes
    if (isAuthenticated && !hasFetched.current) {
      hasFetched.current = true;
      fetchCart();
    }
    if (!isAuthenticated) {
      hasFetched.current = false;
    }
  }, [isAuthenticated, fetchCart, pathname]);

  const handleAddToCart = async (data: AddToCartData) => {
    if (!isAuthenticated) {
      const { default: toast } = await import('react-hot-toast');
      toast.error('Please log in to add items to cart.');
      return;
    }
    await addToCart(data);
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    await updateQuantity(itemId, quantity);
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeItem(itemId);
  };

  return {
    cart,
    items: cart?.items || [],
    isLoading,
    isUpdating,
    totalItems: totalItems(),
    totalPrice: totalPrice(),
    addToCart: handleAddToCart,
    updateQuantity: handleUpdateQuantity,
    removeItem: handleRemoveItem,
    clearCart,
    fetchCart,
    isEmpty: !cart || cart.items.length === 0,
  };
}
