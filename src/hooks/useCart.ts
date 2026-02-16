'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import type { AddToCartData } from '@/types';

export function useCart() {
  const {
    cart,
    guestCart,
    isLoading,
    isUpdating,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    totalItems,
    totalPrice,
    mergeGuestCart,
    getActiveCart,
  } = useCartStore();

  const { isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const hasFetched = useRef(false);
  const hasMerged = useRef(false);

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
      hasMerged.current = false;
    }
  }, [isAuthenticated, fetchCart, pathname]);

  // Merge guest cart into server cart after login
  useEffect(() => {
    if (isAuthenticated && guestCart && guestCart.items.length > 0 && !hasMerged.current) {
      hasMerged.current = true;
      mergeGuestCart();
    }
  }, [isAuthenticated, guestCart, mergeGuestCart]);

  const activeCart = getActiveCart(isAuthenticated);

  const handleAddToCart = async (data: AddToCartData) => {
    await addToCart(data, isAuthenticated);
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    await updateQuantity(itemId, quantity, isAuthenticated);
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeItem(itemId, isAuthenticated);
  };

  const handleClearCart = async () => {
    await clearCart(isAuthenticated);
  };

  return {
    cart: activeCart,
    items: activeCart?.items || [],
    isLoading,
    isUpdating,
    totalItems: totalItems(isAuthenticated),
    totalPrice: totalPrice(isAuthenticated),
    addToCart: handleAddToCart,
    updateQuantity: handleUpdateQuantity,
    removeItem: handleRemoveItem,
    clearCart: handleClearCart,
    fetchCart,
    isEmpty: !activeCart || activeCart.items.length === 0,
    isAuthenticated,
  };
}
