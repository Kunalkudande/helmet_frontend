'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/types';
import { formatPrice, getPlaceholderImage, getSizeDisplayName } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  isUpdating?: boolean;
}

export function CartItemCard({ item, onUpdateQuantity, onRemove, isUpdating }: CartItemProps) {
  const imageUrl = item.product.images?.[0]?.imageUrl || getPlaceholderImage(100, 100, item.product.name);
  
  // Compute price from product data since backend doesn't include computed fields
  const unitPrice = item.product.discountPrice
    ? Number(item.product.discountPrice)
    : Number(item.product.price);
  const variantExtra = item.variant?.additionalPrice ? Number(item.variant.additionalPrice) : 0;
  const itemTotal = (unitPrice + variantExtra) * item.quantity;

  return (
    <div className="flex gap-4 py-4 border-b border-white/5 last:border-0">
      {/* Image */}
      <Link href={`/products/${item.product.slug}`} className="flex-shrink-0">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-white/5">
          <Image
            src={imageUrl}
            alt={item.product.name}
            width={96}
            height={96}
            className="w-full h-full object-cover"
            unoptimized={imageUrl.includes('placehold.co')}
          />
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.product.slug}`}>
          <h4 className="text-sm font-semibold text-white hover:text-accent-400 transition truncate">
            {item.product.name}
          </h4>
        </Link>
        <p className="text-xs text-brand-500 mt-0.5">{item.product.brand}</p>
        {item.variant && (
          <div className="flex items-center gap-2 mt-1">
            {item.variant.size && (
              <span className="text-xs text-brand-400">Size: {getSizeDisplayName(item.variant.size)}</span>
            )}
            {item.variant.color && (
              <>
                {item.variant.size && <span className="text-xs text-brand-600">|</span>}
                <span className="text-xs text-brand-400">Color: {item.variant.color}</span>
              </>
            )}
          </div>
        )}

        {/* Price & quantity */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1 || isUpdating}
              className="w-7 h-7 rounded-md border border-white/10 flex items-center justify-center text-brand-400 hover:border-accent-500 hover:text-accent-500 transition disabled:opacity-50"
            >
              <Minus size={14} />
            </button>
            <span className="text-sm font-semibold text-white w-8 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={isUpdating}
              className="w-7 h-7 rounded-md border border-white/10 flex items-center justify-center text-brand-400 hover:border-accent-500 hover:text-accent-500 transition disabled:opacity-50"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-bold text-white">{formatPrice(itemTotal)}</span>
            <button
              onClick={() => onRemove(item.id)}
              disabled={isUpdating}
              className="p-1.5 text-brand-500 hover:text-red-400 transition"
              title="Remove item"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
