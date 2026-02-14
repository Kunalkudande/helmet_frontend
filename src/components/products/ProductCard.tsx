'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Eye } from 'lucide-react';
import { Product } from '@/types';
import { StarRating } from '@/components/ui/StarRating';
import { formatPrice, getDiscountPercentage, getPlaceholderImage, cn } from '@/lib/utils';
import { useWishlist } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const imageUrl = primaryImage?.imageUrl || getPlaceholderImage(400, 400, product.name);
  const discountPrice = product.discountPrice ? Number(product.discountPrice) : null;
  const price = Number(product.price);
  const hasDiscount = discountPrice && discountPrice < price;
  const discount = hasDiscount ? getDiscountPercentage(discountPrice, price) : 0;

  const { isAuthenticated } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Sign in to save items');
      return;
    }

    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product.id);
      toast.success('Added to wishlist');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group relative"
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image container */}
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/10 mb-4">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discount > 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-red-500 text-white shadow-sm">
                -{discount}%
              </span>
            )}
            {product.stock === 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-800 text-white shadow-sm">
                Sold out
              </span>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 text-white shadow-sm">
                Only {product.stock} left
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button
              onClick={handleToggleWishlist}
              className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm',
                inWishlist
                  ? 'bg-red-500 text-white shadow-medium scale-100'
                  : 'bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white shadow-soft'
              )}
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} strokeWidth={2} />
            </button>
          </div>

          {/* Quick view bar */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <div className="bg-accent-500/90 backdrop-blur-sm rounded-xl py-2.5 text-center shadow-medium flex items-center justify-center gap-2">
              <Eye size={14} className="text-white" />
              <span className="text-sm font-medium text-white">Quick View</span>
            </div>
          </div>
        </div>

        {/* Product info */}
        <div className="space-y-1.5">
          {/* Brand */}
          <p className="text-xs font-medium text-accent-400 uppercase tracking-wider">{product.brand}</p>

          {/* Name */}
          <h3 className="text-sm font-medium text-white leading-snug truncate-2 group-hover:text-accent-400 transition-colors duration-200">
            {product.name}
          </h3>

          {/* Rating */}
          {product.totalReviews > 0 && (
            <div className="flex items-center gap-1.5">
              <StarRating rating={Number(product.rating)} size={12} />
              <span className="text-xs text-brand-500">({product.totalReviews})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-lg font-semibold text-white">
              {formatPrice(hasDiscount ? discountPrice : price)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-sm text-brand-500 line-through">
                  {formatPrice(price)}
                </span>
                <span className="text-xs font-semibold text-green-400">
                  {discount}% off
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
