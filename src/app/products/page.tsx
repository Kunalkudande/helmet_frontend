'use client';

import React, { Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, X, ChevronLeft, ChevronRight, ArrowUpDown, Sparkles, Shield, Zap } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductFilters } from '@/components/products/ProductFilters';
import type { ProductFilters as ProductFiltersType, ProductCategory, ProductSize } from '@/types/product';
import { ProductGridSkeleton } from '@/components/ui/Loader';
import { SORT_OPTIONS, CATEGORIES, PRICE_RANGES } from '@/lib/constants';
import { getCategoryDisplayName, getSizeDisplayName, cn } from '@/lib/utils';
import { useUIStore } from '@/store/uiStore';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isFilterSidebarOpen, openFilterSidebar, closeFilterSidebar } = useUIStore();

  const filters: ProductFiltersType = {
    category: (searchParams.get('category') || undefined) as ProductCategory | undefined,
    brand: searchParams.get('brand') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    size: (searchParams.get('size') || undefined) as ProductSize | undefined,
    rating: searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined,
    search: searchParams.get('search') || undefined,
    sort: searchParams.get('sort') || 'newest',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    limit: 12,
    featured: searchParams.get('featured') === 'true' ? true : undefined,
  };

  const { data, isLoading } = useProducts(filters);
  const products = data?.products || [];
  const pagination = data?.pagination;

  // Build page title & subtitle
  let pageTitle = 'All Helmets';
  let pageSubtitle = 'Explore our curated collection of premium, certified helmets';
  if (filters.search) {
    pageTitle = `Results for "${filters.search}"`;
    pageSubtitle = 'Showing helmets matching your search';
  } else if (filters.category) {
    pageTitle = `${getCategoryDisplayName(filters.category)} Helmets`;
    const cat = CATEGORIES.find((c) => c.value === filters.category);
    pageSubtitle = cat ? cat.description : 'Browse our selection';
  } else if (filters.brand) {
    pageTitle = `${filters.brand} Helmets`;
    pageSubtitle = `Official ${filters.brand} collection`;
  } else if (filters.featured) {
    pageTitle = 'Featured Helmets';
    pageSubtitle = 'Hand-picked favourites from our experts';
  }

  // Active filter chips
  const activeFilters = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];
    const removeFilter = (key: string, alsoRemove?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      if (alsoRemove) params.delete(alsoRemove);
      params.set('page', '1');
      router.push(`/products?${params.toString()}`);
    };

    if (filters.category) {
      chips.push({ key: 'category', label: getCategoryDisplayName(filters.category), onRemove: () => removeFilter('category') });
    }
    if (filters.brand) {
      chips.push({ key: 'brand', label: filters.brand, onRemove: () => removeFilter('brand') });
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const range = PRICE_RANGES.find((r) => r.min === filters.minPrice && r.max === filters.maxPrice);
      chips.push({ key: 'price', label: range?.label || `₹${filters.minPrice || 0} - ₹${filters.maxPrice || '∞'}`, onRemove: () => removeFilter('minPrice', 'maxPrice') });
    }
    if (filters.size) {
      chips.push({ key: 'size', label: `Size: ${getSizeDisplayName(filters.size)}`, onRemove: () => removeFilter('size') });
    }
    if (filters.rating) {
      chips.push({ key: 'rating', label: `${filters.rating}★ & above`, onRemove: () => removeFilter('rating') });
    }
    if (filters.search) {
      chips.push({ key: 'search', label: `"${filters.search}"`, onRemove: () => removeFilter('search') });
    }
    return chips;
  }, [filters, searchParams, router]);

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push('/products');
  };

  // Pagination range helper
  const getPaginationRange = (current: number, total: number) => {
    const delta = 2;
    const range: (number | 'ellipsis')[] = [];
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      } else if (range[range.length - 1] !== 'ellipsis') {
        range.push('ellipsis');
      }
    }
    return range;
  };

  return (
    <div className="min-h-screen bg-[hsl(0,0%,5%)]">
      {/* Hero Header */}
      <div className="relative bg-[hsl(0,0%,7%)] overflow-hidden border-b border-white/5">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        </div>
        {/* Gradient accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="container-custom relative py-12 md:py-16">
          <div className="max-w-2xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-brand-400 mb-6">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <span>/</span>
              <span className="text-white">Shop</span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-3xl md:text-4xl lg:text-5xl font-display text-white tracking-tight"
            >
              {pageTitle}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-brand-300 text-base md:text-lg mt-3 leading-relaxed"
            >
              {pageSubtitle}
            </motion.p>

            {/* Quick stats */}
            {pagination && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex items-center gap-6 mt-6"
              >
                <div className="flex items-center gap-2 text-sm text-brand-300">
                  <Shield size={14} className="text-accent-400" />
                  <span><strong className="text-white">{pagination.total}</strong> helmets available</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-brand-300">
                  <Sparkles size={14} className="text-accent-400" />
                  <span>ISI & DOT certified</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex gap-8">
          {/* Filters sidebar - desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <ProductFilters />
            </div>
          </aside>

          {/* Products area */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center justify-between">
                {/* Mobile filter button */}
                <button
                  onClick={openFilterSidebar}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white hover:border-accent-500/30 transition-all"
                >
                  <SlidersHorizontal size={16} />
                  Filters
                  {activeFilters.length > 0 && (
                    <span className="ml-1 w-5 h-5 rounded-full bg-accent-500 text-white text-xs flex items-center justify-center">
                      {activeFilters.length}
                    </span>
                  )}
                </button>

                {/* Result count - desktop */}
                <div className="hidden lg:block">
                  {pagination && (
                    <p className="text-sm text-brand-500">
                      Showing <span className="font-medium text-white">{(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-medium text-white">{pagination.total}</span> helmets
                    </p>
                  )}
                </div>

                {/* Sort dropdown */}
                <div className="flex items-center gap-2 ml-auto">
                  <ArrowUpDown size={14} className="text-brand-400 hidden sm:block" />
                  <select
                    value={filters.sort}
                    onChange={(e) => {
                      const params = new URLSearchParams(searchParams.toString());
                      params.set('sort', e.target.value);
                      params.set('page', '1');
                      router.push(`/products?${params.toString()}`);
                    }}
                    className="px-4 py-2.5 bg-[hsl(0,0%,10%)] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500/50 transition-all cursor-pointer hover:border-white/20 appearance-none pr-8"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value} className="bg-[hsl(0,0%,10%)] text-white">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active filter chips */}
              {activeFilters.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex flex-wrap items-center gap-2"
                >
                  <span className="text-xs font-medium text-brand-500 uppercase tracking-wide mr-1">Active:</span>
                  {activeFilters.map((chip) => (
                    <motion.button
                      key={chip.key}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={chip.onRemove}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-500/10 text-accent-400 rounded-lg text-xs font-medium border border-accent-500/20 hover:bg-accent-500/20 hover:border-accent-500/30 transition-all group"
                    >
                      {chip.label}
                      <X size={12} className="text-accent-400/60 group-hover:text-accent-300 transition-colors" />
                    </motion.button>
                  ))}
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-medium text-brand-500 hover:text-accent-400 underline underline-offset-2 transition-colors ml-1"
                  >
                    Clear all
                  </button>
                </motion.div>
              )}
            </div>

            {/* Products grid */}
            <ProductGrid
              products={products}
              isLoading={isLoading}
              emptyMessage="No helmets found matching your criteria"
            />

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-12">
                {/* Previous button */}
                <button
                  onClick={() => navigateToPage(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                    pagination.page === 1
                      ? 'text-brand-600 cursor-not-allowed'
                      : 'text-white bg-white/5 border border-white/10 hover:border-accent-500/30'
                  )}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Page numbers */}
                {getPaginationRange(pagination.page, pagination.totalPages).map((item, idx) =>
                  item === 'ellipsis' ? (
                    <span key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center text-brand-500 text-sm">
                      ···
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => navigateToPage(item as number)}
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all',
                        (item as number) === pagination.page
                          ? 'bg-accent-500 text-white shadow-medium'
                          : 'bg-white/5 border border-white/10 text-brand-400 hover:border-accent-500/30 hover:text-white'
                      )}
                    >
                      {item}
                    </button>
                  )
                )}

                {/* Next button */}
                <button
                  onClick={() => navigateToPage(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                    pagination.page === pagination.totalPages
                      ? 'text-brand-600 cursor-not-allowed'
                      : 'text-white bg-white/5 border border-white/10 hover:border-accent-500/30'
                  )}
                  aria-label="Next page"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter sidebar */}
      <AnimatePresence>
        {isFilterSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overlay lg:hidden"
              onClick={closeFilterSidebar}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-[hsl(0,0%,7%)] z-50 overflow-y-auto shadow-xl lg:hidden scrollbar-thin border-r border-white/5"
            >
              <ProductFilters isMobile onClose={closeFilterSidebar} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container-custom py-8"><ProductGridSkeleton /></div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
