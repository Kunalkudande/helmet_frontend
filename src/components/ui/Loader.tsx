import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Spinner Loader
export function Spinner({ size = 'md', className }: LoaderProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <Loader2
      className={cn('animate-spin text-accent-500', sizes[size], className)}
    />
  );
}

// Full Page Loader
export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[hsl(0,0%,5%)]/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-brand-400 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

// Section Loader
export function SectionLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center py-12', className)}>
      <Spinner size="md" />
    </div>
  );
}

// Skeleton Components
export function ProductCardSkeleton() {
  return (
    <div>
      <div className="aspect-[3/4] bg-white/10 rounded-2xl animate-pulse mb-4" />
      <div className="space-y-2">
        <div className="h-3 bg-white/10 rounded animate-pulse w-1/3" />
        <div className="h-4 bg-white/10 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-white/10 rounded animate-pulse w-1/2" />
        <div className="h-5 bg-white/10 rounded animate-pulse w-2/5 mt-1" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="container-custom py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image skeleton */}
        <div className="space-y-4">
          <div className="aspect-square bg-white/10 rounded-2xl animate-pulse" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-20 h-20 bg-white/10 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
        {/* Info skeleton */}
        <div className="space-y-4">
          <div className="h-4 bg-white/10 rounded animate-pulse w-1/4" />
          <div className="h-8 bg-white/10 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-white/10 rounded animate-pulse w-1/3" />
          <div className="h-6 bg-white/10 rounded animate-pulse w-1/4" />
          <div className="space-y-2">
            <div className="h-3 bg-white/10 rounded animate-pulse" />
            <div className="h-3 bg-white/10 rounded animate-pulse" />
            <div className="h-3 bg-white/10 rounded animate-pulse w-2/3" />
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-12 h-12 bg-white/10 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="h-12 bg-white/10 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function OrderSkeleton() {
  return (
    <div className="bg-white/[0.03] rounded-xl border border-white/10 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-5 bg-white/10 rounded animate-pulse w-1/4" />
        <div className="h-6 bg-white/10 rounded-full animate-pulse w-20" />
      </div>
      <div className="flex gap-4">
        <div className="w-16 h-16 bg-white/10 rounded-lg animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/10 rounded animate-pulse w-1/2" />
          <div className="h-3 bg-white/10 rounded animate-pulse w-1/3" />
        </div>
      </div>
    </div>
  );
}
