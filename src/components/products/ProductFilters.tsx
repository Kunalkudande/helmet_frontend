'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown, ChevronUp, Star, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { CATEGORIES, BRANDS, PRICE_RANGES, SIZES, SORT_OPTIONS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ProductFiltersProps {
  onClose?: () => void;
  isMobile?: boolean;
}

export function ProductFilters({ onClose, isMobile = false }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') || '';
  const currentBrand = searchParams.get('brand') || '';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentSize = searchParams.get('size') || '';
  const currentRating = searchParams.get('rating') || '';

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: false,
    brand: false,
    price: false,
    size: false,
    rating: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push('/products');
    if (onClose) onClose();
  };

  const hasActiveFilters = currentCategory || currentBrand || currentMinPrice || currentMaxPrice || currentSize || currentRating;

  const activeFilterCount = [currentCategory, currentBrand, currentMinPrice || currentMaxPrice, currentSize, currentRating].filter(Boolean).length;

  const FilterSection = ({ title, name, children }: { title: string; name: string; children: React.ReactNode }) => (
    <div className="border-b border-white/5 last:border-b-0">
      <button
        onClick={() => toggleSection(name)}
        className="flex items-center justify-between w-full py-4 text-sm font-semibold text-white hover:text-accent-400 transition-colors"
      >
        {title}
        <ChevronDown
          size={16}
          className={cn(
            'text-brand-500 transition-transform duration-200',
            expandedSections[name] && 'rotate-180'
          )}
        />
      </button>
      <AnimatePresence>
        {expandedSections[name] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-4 space-y-1.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className={cn(
      'bg-white/[0.03] border border-white/10',
      isMobile ? 'p-5' : 'rounded-2xl p-5'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-500/20 flex items-center justify-center">
            <SlidersHorizontal size={14} className="text-accent-500" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">Filters</h3>
            {activeFilterCount > 0 && (
              <p className="text-xs text-brand-500">{activeFilterCount} active</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-accent-500 hover:text-accent-400 font-medium transition-colors"
            >
              Clear All
            </button>
          )}
          {isMobile && onClose && (
            <button onClick={onClose} className="p-1.5 text-brand-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Category */}
      <FilterSection title="Category" name="category">
        {CATEGORIES.map((cat) => {
          const isActive = currentCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => updateFilter('category', isActive ? '' : cat.value)}
              className={cn(
                'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-all duration-150',
                isActive
                  ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20'
                  : 'text-brand-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden',
                isActive ? 'bg-accent-500/20' : 'bg-white/5'
              )}>
                <Image
                  src={cat.image}
                  alt={cat.label}
                  width={20}
                  height={20}
                  className={cn(isActive && 'brightness-0 invert')}
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium block">{cat.label}</span>
                <span className={cn('text-xs', isActive ? 'text-accent-400/60' : 'text-brand-500')}>{cat.description}</span>
              </div>
              {isActive && (
                <Check size={14} className="flex-shrink-0" />
              )}
            </button>
          );
        })}
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand" name="brand">
        {BRANDS.map((brand) => {
          const isActive = currentBrand === brand;
          return (
            <button
              key={brand}
              onClick={() => updateFilter('brand', isActive ? '' : brand)}
              className={cn(
                'flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm transition-all duration-150',
                isActive
                  ? 'bg-accent-500/10 text-accent-400 font-medium'
                  : 'text-brand-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <div className={cn(
                'w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                isActive ? 'border-accent-500 bg-accent-500' : 'border-brand-600'
              )}>
                {isActive && <Check size={10} className="text-white" strokeWidth={3} />}
              </div>
              {brand}
            </button>
          );
        })}
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range" name="price">
        {PRICE_RANGES.map((range) => {
          const isActive = currentMinPrice === String(range.min) && currentMaxPrice === String(range.max);
          return (
            <button
              key={range.label}
              onClick={() => {
                if (isActive) {
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete('minPrice');
                  params.delete('maxPrice');
                  params.set('page', '1');
                  router.push(`/products?${params.toString()}`);
                } else {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set('minPrice', String(range.min));
                  params.set('maxPrice', String(range.max));
                  params.set('page', '1');
                  router.push(`/products?${params.toString()}`);
                }
              }}
              className={cn(
                'flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm transition-all duration-150',
                isActive
                  ? 'bg-accent-500/10 text-accent-400 font-medium'
                  : 'text-brand-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <div className={cn(
                'w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                isActive ? 'border-accent-500 bg-accent-500' : 'border-brand-600'
              )}>
                {isActive && <Check size={10} className="text-white" strokeWidth={3} />}
              </div>
              {range.label}
            </button>
          );
        })}
      </FilterSection>

      {/* Size */}
      <FilterSection title="Size" name="size">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size.value}
              onClick={() => updateFilter('size', currentSize === size.value ? '' : size.value)}
              className={cn(
                'px-3 py-2 text-xs font-semibold rounded-xl border transition-all duration-150',
                currentSize === size.value
                  ? 'bg-accent-500 text-white border-accent-500 shadow-sm'
                  : 'border-white/10 text-brand-400 hover:border-accent-500/30 hover:text-white'
              )}
              title={size.headSize}
            >
              {size.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-brand-500 mt-2 px-1">Hover to see head size in cm</p>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Rating" name="rating">
        {[4, 3, 2, 1].map((rating) => {
          const isActive = currentRating === String(rating);
          return (
            <button
              key={rating}
              onClick={() => updateFilter('rating', isActive ? '' : String(rating))}
              className={cn(
                'flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm transition-all duration-150',
                isActive
                  ? 'bg-amber-500/10 text-amber-400 font-medium'
                  : 'text-brand-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    fill={i < rating ? 'currentColor' : 'none'}
                    className={i < rating ? 'text-amber-400' : 'text-brand-600'}
                    strokeWidth={2}
                  />
                ))}
              </div>
              <span>& above</span>
            </button>
          );
        })}
      </FilterSection>

      {/* Mobile apply button */}
      {isMobile && (
        <div className="mt-5 pt-4 border-t border-white/5">
          <Button onClick={onClose} fullWidth>
            Show Results
          </Button>
        </div>
      )}
    </div>
  );
}
