'use client';

import React from 'react';
import Link from 'next/link';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useCart } from '@/hooks/useCart';
import { CartItemCard } from './CartItem';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export function CartDrawer() {
  const { isCartDrawerOpen, closeCartDrawer } = useUIStore();
  const { items, totalItems, totalPrice, updateQuantity, removeItem, isUpdating, isEmpty } = useCart();

  if (!isCartDrawerOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-brand-950/40 backdrop-blur-sm z-50"
        onClick={closeCartDrawer}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[hsl(0,0%,7%)] z-50 flex flex-col shadow-strong border-l border-white/5">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-accent-500" />
            <h2 className="font-semibold text-white">
              Cart ({totalItems})
            </h2>
          </div>
          <button
            onClick={closeCartDrawer}
            className="btn-icon"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-6">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center mb-4">
                <ShoppingBag size={24} className="text-brand-500" />
              </div>
              <h3 className="text-heading-sm text-white mb-2">Your cart is empty</h3>
              <p className="text-sm text-brand-500 mb-6">Add items to get started</p>
              <Link href="/products" onClick={closeCartDrawer}>
                <Button>Browse Products</Button>
              </Link>
            </div>
          ) : (
            <div className="py-4 space-y-4">
              {items.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                  isUpdating={isUpdating}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isEmpty && (
          <div className="border-t border-white/5 px-6 py-5 space-y-4 bg-white/[0.02]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-brand-400">Subtotal</span>
              <span className="text-lg font-semibold text-white">{formatPrice(totalPrice)}</span>
            </div>
            <p className="text-caption text-brand-500">Shipping calculated at checkout</p>
            <div className="flex gap-3">
              <Link href="/cart" onClick={closeCartDrawer} className="flex-1">
                <Button variant="secondary" fullWidth>
                  View Cart
                </Button>
              </Link>
              <Link href="/checkout" onClick={closeCartDrawer} className="flex-1">
                <Button fullWidth rightIcon={<ArrowRight size={16} />}>
                  Checkout
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
