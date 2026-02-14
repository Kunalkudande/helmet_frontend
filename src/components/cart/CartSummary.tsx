'use client';

import React from 'react';
import { formatPrice } from '@/lib/utils';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST, GST_RATE } from '@/lib/constants';
import { Truck, ShieldCheck, Tag } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
  onCheckout: () => void;
  isLoading?: boolean;
  couponDiscount?: number;
  couponCode?: string;
}

export function CartSummary({
  subtotal,
  itemCount,
  onCheckout,
  isLoading = false,
  couponDiscount = 0,
  couponCode,
}: CartSummaryProps) {
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = isFreeShipping ? 0 : SHIPPING_COST;
  const tax = Math.round(subtotal * GST_RATE);
  const total = subtotal + shipping + tax - couponDiscount;
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="bg-white/[0.03] rounded-xl border border-white/10 p-6">
      <h3 className="font-semibold text-lg text-white mb-4">Order Summary</h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-brand-400">Subtotal ({itemCount} items)</span>
          <span className="font-medium text-white">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-brand-400">Shipping</span>
          <span className={`font-medium ${isFreeShipping ? 'text-green-400' : 'text-white'}`}>
            {isFreeShipping ? 'FREE' : formatPrice(shipping)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-brand-400">GST (18%)</span>
          <span className="font-medium text-white">{formatPrice(tax)}</span>
        </div>

        {couponDiscount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-400 flex items-center gap-1">
              <Tag size={14} />
              Coupon ({couponCode})
            </span>
            <span className="font-medium text-green-400">-{formatPrice(couponDiscount)}</span>
          </div>
        )}

        <div className="border-t border-white/5 pt-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white">Total</span>
            <span className="text-xl font-bold text-white">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Free shipping progress */}
      {!isFreeShipping && subtotal > 0 && (
        <div className="mt-4 p-3 bg-accent-500/10 rounded-lg border border-accent-500/20">
          <div className="flex items-center gap-2 text-xs text-accent-400 mb-2">
            <Truck size={14} />
            <span>Add {formatPrice(amountToFreeShipping)} more for free shipping!</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Checkout button */}
      <Button
        onClick={onCheckout}
        fullWidth
        size="lg"
        isLoading={isLoading}
        className="mt-4"
      >
        Proceed to Checkout
      </Button>

      {/* Trust badges */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-brand-500">
        <div className="flex items-center gap-1">
          <ShieldCheck size={14} />
          <span>Secure Payment</span>
        </div>
        <div className="flex items-center gap-1">
          <Truck size={14} />
          <span>Fast Delivery</span>
        </div>
      </div>
    </div>
  );
}
