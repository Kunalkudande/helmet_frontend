'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Loader';
import { IMAGES } from '@/lib/constants';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyMessage?: string;
  columns?: 2 | 3 | 4;
}

export function ProductGrid({
  products,
  isLoading = false,
  emptyMessage = 'No products found',
  columns = 4,
}: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton count={columns * 2} />;
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-32 h-32 mb-6 relative opacity-60">
          <Image
            src={IMAGES.noProductImage}
            alt="No products found"
            fill
            className="object-contain"
          />
        </div>
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <Search size={18} className="text-brand-500" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">{emptyMessage}</h3>
        <p className="text-sm text-brand-500 max-w-sm">
          Try adjusting your search or filters to find what you&apos;re looking for.
        </p>
        <Link
          href="/products"
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent-500 hover:text-accent-400 transition-colors"
        >
          Browse all helmets
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 md:gap-6`}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
