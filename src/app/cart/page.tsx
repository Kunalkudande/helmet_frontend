'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { CartItemCard } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
  const router = useRouter();
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart, isUpdating, isEmpty } = useCart();

  if (isEmpty) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-brand-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-brand-500 mb-8">Looks like you haven&apos;t added any helmets yet.</p>
          <Link href="/products">
            <Button size="lg">Browse Helmets</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[hsl(0,0%,5%)] min-h-screen">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display text-white">Shopping Cart</h1>
            <p className="text-sm text-brand-500 mt-1">{totalItems} items in your cart</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/products">
              <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={16} />}>
                Continue Shopping
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={clearCart} leftIcon={<Trash2 size={16} />} className="text-red-400 hover:bg-red-500/10">
              Clear Cart
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div className="bg-white/[0.03] rounded-xl border border-white/10 p-6">
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
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CartSummary
                subtotal={totalPrice}
                itemCount={totalItems}
                onCheckout={() => router.push('/checkout')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
